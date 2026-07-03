import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function optionalAuth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("_id email role isActive");

    if (user?.isActive) {
      req.user = user;
    }

    return next();
  } catch {
    return next();
  }
}

export async function requireAuth(req, res, next) {
  await optionalAuth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ error: "Please log in to use this tool." });
    }

    return next();
  });
}
