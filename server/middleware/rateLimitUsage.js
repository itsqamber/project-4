import mongoose from "mongoose";
import Usage from "../models/Usage.js";

const FREE_DAILY_LIMIT = 3;
const REGISTERED_DAILY_LIMIT = 20;

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || "unknown";
}

function getAuthenticatedUserId(req) {
  const candidate = req.user?._id || req.user?.id || req.auth?.userId || req.headers["x-user-id"];
  const userId = Array.isArray(candidate) ? candidate[0] : candidate;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  return new mongoose.Types.ObjectId(userId);
}

function buildLimitResponse({ limit, count, registered }) {
  return {
    error: `Daily AI generation limit reached. ${registered ? "Registered users" : "Free users"} can generate ${limit} times per day.`,
    limit,
    used: count,
    remaining: 0,
    registered
  };
}

export function limitDailyGenerations(toolName) {
  return async function usageRateLimiter(req, res, next) {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Usage tracking database is unavailable. Please try again later." });
    }

    try {
      const userId = getAuthenticatedUserId(req);
      const registered = Boolean(userId);
      const limit = registered ? REGISTERED_DAILY_LIMIT : FREE_DAILY_LIMIT;
      const dateKey = getDateKey();
      const ipAddress = getClientIp(req);
      const query = registered ? { userId, toolName, dateKey } : { userId: null, ipAddress, toolName, dateKey };

      const usage = await Usage.findOneAndUpdate(
        query,
        {
          $setOnInsert: {
            userId: registered ? userId : null,
            ipAddress,
            toolName,
            dateKey
          },
          $inc: { count: 1 },
          $set: { lastUsedAt: new Date() }
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      ).lean();

      if (usage.count > limit) {
        await Usage.updateOne(query, {
          $inc: { count: -1 },
          $set: { lastUsedAt: new Date() }
        });

        return res.status(429).json(buildLimitResponse({ limit, count: limit, registered }));
      }

      req.usage = {
        limit,
        used: usage.count,
        remaining: Math.max(limit - usage.count, 0),
        registered,
        toolName,
        dateKey
      };

      return next();
    } catch (error) {
      if (error.code === 11000) {
        return res.status(429).json({
          error: "Too many requests. Please retry in a moment."
        });
      }

      return next(error);
    }
  };
}
