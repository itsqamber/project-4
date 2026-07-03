import React from "react";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import {
  FileText,
  ImageOff,
  Megaphone,
  Sparkles,
  ArrowRight,
  Clipboard,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus,
  Trash2,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  User,
  Lock,
  LogOut,
  Mail,
  UserPlus,
  Crown,
  Wand2,
  Video,
  Palette
} from "lucide-react";
import "./styles.css";

const tools = [
  {
    title: "AI Resume Builder",
    description: "Create a polished, job-ready resume with smart phrasing and clean formatting in minutes.",
    icon: FileText,
    shadow: "shadow-neon",
    iconClass: "text-cyanGlow",
    ringClass: "ring-cyanGlow/25",
    buttonClass: "from-cyan-400 to-blue-500",
    id: "resume-builder"
  },
  {
    title: "Image Background Remover",
    description: "Remove photo backgrounds instantly for product shots, profiles, thumbnails, and campaigns.",
    icon: ImageOff,
    shadow: "shadow-neon-lime",
    iconClass: "text-limeGlow",
    ringClass: "ring-limeGlow/25",
    buttonClass: "from-lime-300 to-emerald-500",
    id: "background-remover"
  },
  {
    title: "AI Social Media Post Generator",
    description: "Turn a quick idea into scroll-stopping captions, hooks, and post variations for any channel.",
    icon: Megaphone,
    shadow: "shadow-neon-rose",
    iconClass: "text-roseGlow",
    ringClass: "ring-roseGlow/25",
    buttonClass: "from-rose-400 to-fuchsia-500",
    id: "post-generator"
  }
];

const tones = ["professional", "funny", "friendly", "inspirational", "bold"];
const platforms = ["LinkedIn", "Instagram", "X", "Facebook", "TikTok"];
const resumeSteps = ["Profile", "Skills", "Background"];
const premiumTabs = [
  {
    id: "background-changer",
    label: "AI Background Changer",
    icon: Palette
  },
  {
    id: "text-to-image",
    label: "Text to Image",
    icon: Wand2
  },
  {
    id: "text-to-video",
    label: "Text to Video",
    icon: Video
  }
];

const emptyResumeForm = {
  fullName: "",
  contact: "",
  skills: [""],
  experience: "",
  education: ""
};

const SESSION_STORAGE_KEY = "ai-micro-tools-session";
const TOKEN_STORAGE_KEY = "ai-micro-tools-token";
const API_BASE_URL = "http://localhost:3001";

function getStoredSession() {
  try {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
      return null;
    }

    return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function saveStoredSession(user) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

function saveAuthSession({ token, user }) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  saveStoredSession(user);
}

function getAuthHeaders() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  return token ? { Authorization: `Bearer ${token}` } : {};
}

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!email || !password || (isSignup && !form.name.trim())) {
      setError("Please complete all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";
      const body = isSignup ? { name: form.name.trim(), email, password } : { email, password };
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      saveAuthSession(data);
      onAuthenticated(data.user);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-ink text-slate-100">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.20),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(251,113,133,0.15),transparent_26%),radial-gradient(circle_at_55%_85%,rgba(163,230,53,0.12),transparent_30%)]" />
      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100">
            <Sparkles size={16} className="text-cyanGlow" />
            Premium AI SaaS access
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] text-white sm:text-6xl">
            Sign in to unlock your AI tools
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Create an account to start a 2-month free trial and access Resume Builder, Background Remover, and Post Generator.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-neon backdrop-blur sm:p-7">
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-ink/70 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`min-h-11 rounded-lg text-sm font-bold transition ${
                mode === "login" ? "bg-cyan-300 text-ink" : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className={`min-h-11 rounded-lg text-sm font-bold transition ${
                mode === "signup" ? "bg-cyan-300 text-ink" : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {isSignup && (
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-200">Full Name</span>
                <span className="flex min-h-12 items-center gap-3 rounded-lg border border-white/10 bg-ink/70 px-4 focus-within:border-cyan-300/60 focus-within:ring-2 focus-within:ring-cyan-300/20">
                  <User size={18} className="text-cyanGlow" />
                  <input
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </span>
              </label>
            )}

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-200">Email</span>
              <span className="flex min-h-12 items-center gap-3 rounded-lg border border-white/10 bg-ink/70 px-4 focus-within:border-cyan-300/60 focus-within:ring-2 focus-within:ring-cyan-300/20">
                <Mail size={18} className="text-cyanGlow" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
              </span>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-200">Password</span>
              <span className="flex min-h-12 items-center gap-3 rounded-lg border border-white/10 bg-ink/70 px-4 focus-within:border-cyan-300/60 focus-within:ring-2 focus-within:ring-cyan-300/20">
                <Lock size={18} className="text-cyanGlow" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => updateForm("password", event.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
              </span>
            </label>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100">
                <AlertCircle className="mt-0.5 shrink-0" size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 text-sm font-extrabold text-ink shadow-neon transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Please wait..." : isSignup ? "Start Free Trial" : "Log In"}
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : isSignup ? <UserPlus size={18} /> : <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Nav({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyanGlow shadow-neon">
            <Sparkles size={20} strokeWidth={2.4} />
          </span>
          <span className="text-base font-semibold tracking-wide text-white">AI Micro-Tools</span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          <a className="transition hover:text-white" href="#tools">Tools</a>
          <a className="transition hover:text-white" href="#features">Features</a>
          <a className="transition hover:text-white" href="#pricing">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-white">{user.name || user.email}</p>
            <p className="text-[11px] text-cyan-100">Trial access</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
          >
            Logout
            <LogOut size={16} />
          </button>
        </div>
      </nav>
    </header>
  );
}

function ToolCard({ tool, isActive, onUseTool }) {
  const Icon = tool.icon;

  return (
    <article
      className={`group flex h-full flex-col rounded-lg border bg-white/[0.055] p-5 ${tool.shadow} transition duration-300 hover:-translate-y-1 sm:p-6 ${
        isActive ? "border-cyan-300/50" : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className={`mb-6 grid size-12 place-items-center rounded-lg bg-white/10 ring-1 ${tool.ringClass}`}>
        <Icon className={tool.iconClass} size={24} strokeWidth={2.2} />
      </div>
      <h3 className="text-xl font-semibold leading-tight text-white">{tool.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{tool.description}</p>
      <button
        type="button"
        onClick={() => onUseTool(tool.id)}
        className={`mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${tool.buttonClass} px-4 py-3 text-sm font-bold text-ink transition group-hover:brightness-110`}
      >
        Use Tool
        <ArrowRight size={17} />
      </button>
    </article>
  );
}

function ImageBackgroundRemover() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState("");

  function handleFile(file) {
    setError("");

    if (!file) {
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PNG or JPG image.");
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  async function handleRemoveBackground() {
    if (!imageFile) {
      setError("Upload an image before removing the background.");
      return;
    }

    setError("");
    setIsRemoving(true);

    window.setTimeout(() => {
      setIsRemoving(false);
    }, 1400);
  }

  return (
    <section id="background-remover" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="grid gap-6 rounded-lg border border-lime-300/20 bg-white/[0.05] p-4 shadow-neon-lime backdrop-blur sm:p-6 lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
        <div>
          <p className="text-sm font-bold uppercase text-limeGlow">Image Background Remover</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl">Upload an image and remove the background</h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Drop in a PNG or JPG, preview it instantly, then send it through the remover flow with a clean neon action.
          </p>

          <label
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`mt-7 grid min-h-[220px] cursor-pointer place-items-center rounded-lg border border-dashed p-6 text-center transition ${
              isDragging
                ? "border-lime-300 bg-lime-300/[0.12] shadow-neon-lime"
                : "border-lime-300/30 bg-ink/70 hover:border-lime-300/60 hover:bg-lime-300/[0.08]"
            }`}
          >
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(event) => handleFile(event.target.files?.[0])}
              className="sr-only"
            />
            <span className="grid justify-items-center">
              <span className="grid size-14 place-items-center rounded-lg border border-lime-300/25 bg-lime-300/10 text-limeGlow">
                <UploadCloud size={28} />
              </span>
              <span className="mt-4 text-sm font-bold text-white">Drag and drop your image here</span>
              <span className="mt-2 text-xs leading-5 text-slate-400">or click to browse PNG and JPG files</span>
              {imageFile && <span className="mt-3 text-xs font-semibold text-limeGlow">{imageFile.name}</span>}
            </span>
          </label>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100">
              <AlertCircle className="mt-0.5 shrink-0" size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleRemoveBackground}
            disabled={!imageFile || isRemoving}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-lime-300 to-emerald-500 px-5 text-sm font-extrabold text-ink shadow-neon-lime transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isRemoving ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {isRemoving ? "Removing Background..." : "Remove Background"}
          </button>
        </div>

        <div className="rounded-lg border border-white/10 bg-ink/70 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Image Preview</p>
              <p className="mt-1 text-xs text-slate-400">Uploaded image appears here before processing.</p>
            </div>
            <span className="grid size-10 place-items-center rounded-lg border border-lime-300/25 bg-lime-300/10 text-limeGlow">
              <ImageIcon size={19} />
            </span>
          </div>

          <div className="grid min-h-[360px] place-items-center overflow-hidden rounded-lg border border-dashed border-lime-300/25 bg-white/[0.045]">
            {previewUrl ? (
              <img src={previewUrl} alt="Uploaded preview" className="max-h-[420px] w-full object-contain p-3" />
            ) : (
              <div className="p-6 text-center">
                <ImageOff className="mx-auto text-limeGlow" size={48} />
                <p className="mt-4 text-sm font-bold text-white">No image uploaded yet</p>
                <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">
                  Choose a PNG or JPG to see the preview here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ActiveToolView({ activeTool }) {
  if (activeTool === "resume-builder") {
    return <ResumeBuilder />;
  }

  if (activeTool === "background-remover") {
    return <ImageBackgroundRemover />;
  }

  if (activeTool === "post-generator") {
    return <SocialPostGenerator />;
  }

  return null;
}

function PremiumToolsWorkspace() {
  const [activePremiumTab, setActivePremiumTab] = useState("background-changer");
  const [changerFile, setChangerFile] = useState(null);
  const [changerPreviewUrl, setChangerPreviewUrl] = useState("");
  const [changerPrompt, setChangerPrompt] = useState("");
  const [isChangerDragging, setIsChangerDragging] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageAspectRatio, setImageAspectRatio] = useState("1:1");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoDuration, setVideoDuration] = useState("5s");
  const [premiumError, setPremiumError] = useState("");

  function handleChangerFile(file) {
    setPremiumError("");

    if (!file) {
      return;
    }

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setPremiumError("Please upload a PNG or JPG image for the background changer.");
      return;
    }

    setChangerFile(file);
    setChangerPreviewUrl(URL.createObjectURL(file));
  }

  useEffect(() => {
    return () => {
      if (changerPreviewUrl) {
        URL.revokeObjectURL(changerPreviewUrl);
      }
    };
  }, [changerPreviewUrl]);

  function logBackgroundChanger() {
    console.log("AI Background Changer", {
      imageName: changerFile?.name || null,
      prompt: changerPrompt
    });
  }

  function logTextToImage() {
    console.log("Text to Image Generator", {
      prompt: imagePrompt,
      aspectRatio: imageAspectRatio
    });
  }

  function logTextToVideo() {
    console.log("Text to Video Generator", {
      prompt: videoPrompt,
      duration: videoDuration
    });
  }

  return (
    <section id="premium-tools" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-fuchsia-300/25 bg-fuchsia-300/10 px-3 py-2 text-sm font-bold text-fuchsia-100">
            <Crown size={16} className="text-roseGlow" />
            Premium AI Studio
          </div>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Advanced creation tools</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-300">
          New premium modules for image editing, image generation, and video generation are ready for API wiring.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
        <aside className="rounded-lg border border-white/10 bg-white/[0.05] p-3 shadow-neon backdrop-blur">
          <div className="mb-3 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3">
            <p className="flex items-center gap-2 text-xs font-black uppercase text-cyan-100">
              <Lock size={14} />
              Premium Trial
            </p>
            <p className="mt-2 text-sm font-bold text-white">Free Trial Active: 2 Months Remaining</p>
          </div>

          <div className="grid gap-2">
            {premiumTabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePremiumTab(tab.id)}
                  className={`flex min-h-12 items-center gap-3 rounded-lg border px-3 text-left text-sm font-bold transition ${
                    activePremiumTab === tab.id
                      ? "border-fuchsia-300/50 bg-fuchsia-300/[0.14] text-white"
                      : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08]"
                  }`}
                >
                  <Icon size={18} className={activePremiumTab === tab.id ? "text-roseGlow" : "text-slate-400"} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4 shadow-neon backdrop-blur sm:p-6 lg:p-8">
          {activePremiumTab === "background-changer" && (
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="text-sm font-bold uppercase text-limeGlow">AI Background Changer</p>
                <h3 className="mt-2 text-2xl font-black text-white">Replace an image background with a prompt</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Upload an image and describe the new background style you want.
                </p>

                <label
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsChangerDragging(true);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDragLeave={() => setIsChangerDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsChangerDragging(false);
                    handleChangerFile(event.dataTransfer.files?.[0]);
                  }}
                  className={`mt-6 grid min-h-[190px] cursor-pointer place-items-center rounded-lg border border-dashed p-5 text-center transition ${
                    isChangerDragging
                      ? "border-lime-300 bg-lime-300/[0.12] shadow-neon-lime"
                      : "border-lime-300/30 bg-ink/70 hover:border-lime-300/60 hover:bg-lime-300/[0.08]"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(event) => handleChangerFile(event.target.files?.[0])}
                    className="sr-only"
                  />
                  <span className="grid justify-items-center">
                    <UploadCloud className="text-limeGlow" size={32} />
                    <span className="mt-3 text-sm font-bold text-white">Upload source image</span>
                    <span className="mt-1 text-xs text-slate-400">PNG or JPG</span>
                    {changerFile && <span className="mt-3 text-xs font-semibold text-limeGlow">{changerFile.name}</span>}
                  </span>
                </label>

                <label className="mt-4 grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">Background Prompt</span>
                  <input
                    value={changerPrompt}
                    onChange={(event) => setChangerPrompt(event.target.value)}
                    placeholder="cyberpunk city background"
                    className="min-h-12 rounded-lg border border-white/10 bg-ink/70 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime-300/60 focus:ring-2 focus:ring-lime-300/20"
                  />
                </label>

                {premiumError && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100">
                    <AlertCircle className="mt-0.5 shrink-0" size={16} />
                    <span>{premiumError}</span>
                  </div>
                )}

                <div className="mt-5 rounded-lg border border-fuchsia-300/20 bg-fuchsia-300/10 p-3 text-xs font-semibold text-fuchsia-100">
                  <Lock className="mr-2 inline" size={14} />
                  Premium generation is included during your free trial.
                </div>

                <button
                  type="button"
                  onClick={logBackgroundChanger}
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-lime-300 to-emerald-500 px-5 text-sm font-extrabold text-ink shadow-neon-lime transition hover:brightness-110 sm:w-auto"
                >
                  Change Background ✨
                  <Wand2 size={18} />
                </button>
              </div>

              <div className="rounded-lg border border-white/10 bg-ink/70 p-4">
                <p className="text-sm font-semibold text-white">Source Preview</p>
                <div className="mt-4 grid min-h-[340px] place-items-center overflow-hidden rounded-lg border border-dashed border-lime-300/25 bg-white/[0.045]">
                  {changerPreviewUrl ? (
                    <img src={changerPreviewUrl} alt="Background changer upload preview" className="max-h-[400px] w-full object-contain p-3" />
                  ) : (
                    <div className="p-6 text-center">
                      <ImageIcon className="mx-auto text-limeGlow" size={46} />
                      <p className="mt-4 text-sm font-bold text-white">Preview appears here</p>
                      <p className="mt-2 text-xs text-slate-400">Upload an image to test the state flow.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activePremiumTab === "text-to-image" && (
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-bold uppercase text-cyanGlow">Text to Image Generator</p>
                <h3 className="mt-2 text-2xl font-black text-white">Turn a prompt into a premium visual</h3>
                <label className="mt-6 grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">Image Prompt</span>
                  <textarea
                    value={imagePrompt}
                    onChange={(event) => setImagePrompt(event.target.value)}
                    placeholder="A glossy futuristic AI workspace with neon reflections"
                    className="min-h-40 resize-none rounded-lg border border-white/10 bg-ink/70 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </label>
                <label className="mt-4 grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">Aspect Ratio</span>
                  <select
                    value={imageAspectRatio}
                    onChange={(event) => setImageAspectRatio(event.target.value)}
                    className="min-h-12 rounded-lg border border-white/10 bg-ink/70 px-4 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                  >
                    <option value="1:1">1:1 Square</option>
                    <option value="16:9">16:9 Widescreen</option>
                  </select>
                </label>
                <div className="mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3 text-xs font-semibold text-cyan-100">
                  <Lock className="mr-2 inline" size={14} />
                  Premium image models unlock after generation APIs are connected.
                </div>
                <button
                  type="button"
                  onClick={logTextToImage}
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-300 to-blue-500 px-5 text-sm font-extrabold text-ink shadow-neon transition hover:brightness-110 sm:w-auto"
                >
                  Generate Image ✨
                  <Wand2 size={18} />
                </button>
              </div>

              <div className="grid min-h-[360px] place-items-center rounded-lg border border-dashed border-cyan-300/25 bg-ink/70 p-6 text-center">
                <div>
                  <ImageIcon className="mx-auto text-cyanGlow" size={50} />
                  <p className="mt-4 text-sm font-bold text-white">Generated image preview</p>
                  <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">
                    The button logs the prompt and aspect ratio for now.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePremiumTab === "text-to-video" && (
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-bold uppercase text-roseGlow">Text to Video Generator</p>
                <h3 className="mt-2 text-2xl font-black text-white">Draft short AI video concepts</h3>
                <label className="mt-6 grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">Video Prompt</span>
                  <textarea
                    value={videoPrompt}
                    onChange={(event) => setVideoPrompt(event.target.value)}
                    placeholder="A cinematic product reveal for an AI writing assistant"
                    className="min-h-40 resize-none rounded-lg border border-white/10 bg-ink/70 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-rose-300/60 focus:ring-2 focus:ring-rose-300/20"
                  />
                </label>
                <label className="mt-4 grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">Duration</span>
                  <select
                    value={videoDuration}
                    onChange={(event) => setVideoDuration(event.target.value)}
                    className="min-h-12 rounded-lg border border-white/10 bg-ink/70 px-4 text-sm text-white outline-none transition focus:border-rose-300/60 focus:ring-2 focus:ring-rose-300/20"
                  >
                    <option value="5s">5s</option>
                    <option value="10s">10s</option>
                  </select>
                </label>
                <div className="mt-5 rounded-lg border border-rose-300/20 bg-rose-300/10 p-3 text-xs font-semibold text-rose-100">
                  <Lock className="mr-2 inline" size={14} />
                  Premium video generation will use your paid-plan credits.
                </div>
                <button
                  type="button"
                  onClick={logTextToVideo}
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-400 to-fuchsia-500 px-5 text-sm font-extrabold text-ink shadow-neon-rose transition hover:brightness-110 sm:w-auto"
                >
                  Generate Video 🎬
                  <Video size={18} />
                </button>
              </div>

              <div className="grid min-h-[360px] place-items-center rounded-lg border border-dashed border-rose-300/25 bg-ink/70 p-6 text-center">
                <div>
                  <Video className="mx-auto text-roseGlow" size={52} />
                  <p className="mt-4 text-sm font-bold text-white">Video placeholder/API preview</p>
                  <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">
                    The button logs the prompt and duration for now.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function addWrappedText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function addPdfSection(doc, title, items, y) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const maxWidth = 174;

  if (y > pageHeight - 35) {
    doc.addPage();
    y = 20;
  }

  doc.setTextColor(14, 20, 35);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(title.toUpperCase(), margin, y);
  doc.setDrawColor(34, 211, 238);
  doc.line(margin, y + 2, 192, y + 2);
  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(45, 55, 72);

  items.forEach((item) => {
    if (y > pageHeight - 25) {
      doc.addPage();
      y = 20;
    }

    y = addWrappedText(doc, `- ${item}`, margin, y, maxWidth, 5) + 3;
  });

  return y + 4;
}

function ResumeBuilder() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyResumeForm);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canGenerate =
    form.fullName.trim() &&
    form.contact.trim() &&
    form.skills.some((skill) => skill.trim()) &&
    form.experience.trim() &&
    form.education.trim();

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateSkill(index, value) {
    setForm((current) => ({
      ...current,
      skills: current.skills.map((skill, skillIndex) => (skillIndex === index ? value : skill))
    }));
  }

  function addSkill() {
    setForm((current) => ({ ...current, skills: [...current.skills, ""] }));
  }

  function removeSkill(index) {
    setForm((current) => ({
      ...current,
      skills: current.skills.length === 1 ? [""] : current.skills.filter((_, skillIndex) => skillIndex !== index)
    }));
  }

  async function handleGenerateResume() {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          ...form,
          skills: form.skills.map((skill) => skill.trim()).filter(Boolean)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate resume.");
      }

      setResume(data.resume);
    } catch (resumeError) {
      setError(resumeError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function downloadPdf() {
    if (!resume) {
      return;
    }

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(7, 10, 18);
    doc.rect(0, 0, pageWidth, 38, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(resume.fullName, 18, 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(190, 242, 255);
    doc.text(resume.contact, 18, 28);

    let y = 50;
    doc.setTextColor(14, 20, 35);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("PROFESSIONAL SUMMARY", 18, y);
    doc.setDrawColor(34, 211, 238);
    doc.line(18, y + 2, 192, y + 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(45, 55, 72);
    y = addWrappedText(doc, resume.summary, 18, y + 10, 174, 5) + 8;

    y = addPdfSection(doc, "Skills", [resume.skills.join(", ")], y);
    y = addPdfSection(doc, "Experience", resume.experience, y);
    addPdfSection(doc, "Education", resume.education, y);

    const filename = `${resume.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "resume"}-resume.pdf`;
    doc.save(filename);
  }

  return (
    <section id="resume-builder" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="grid gap-6 rounded-lg border border-white/10 bg-white/[0.05] p-4 shadow-neon backdrop-blur sm:p-6 lg:grid-cols-[0.92fr_1.08fr] lg:p-8">
        <div>
          <p className="text-sm font-bold uppercase text-cyanGlow">AI Resume Builder</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl">Build a polished resume in minutes</h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Complete the steps, let AI sharpen the wording, then download a styled PDF instantly.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-2">
            {resumeSteps.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(index)}
                className={`min-h-11 rounded-lg border px-2 text-xs font-bold transition ${
                  step === index
                    ? "border-cyan-300/50 bg-cyan-300/[0.15] text-cyan-100"
                    : "border-white/10 bg-white/[0.06] text-slate-300 hover:border-white/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-ink/70 p-4">
            {step === 0 && (
              <div className="grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">Full Name</span>
                  <input
                    value={form.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    placeholder="Alex Morgan"
                    className="min-h-12 rounded-lg border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">Contact</span>
                  <input
                    value={form.contact}
                    onChange={(event) => updateField("contact", event.target.value)}
                    placeholder="alex@email.com | 555-0100 | New York, NY | linkedin.com/in/alex"
                    className="min-h-12 rounded-lg border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </label>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-3">
                <span className="text-sm font-semibold text-slate-200">Skills</span>
                {form.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={skill}
                      onChange={(event) => updateSkill(index, event.target.value)}
                      placeholder="Project management"
                      className="min-h-12 flex-1 rounded-lg border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="grid size-12 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.08] text-slate-300 transition hover:border-rose-300/50 hover:text-rose-200"
                      aria-label="Remove skill"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSkill}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-4 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/[0.15]"
                >
                  <Plus size={17} />
                  Add Skill
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">Experience</span>
                  <textarea
                    value={form.experience}
                    onChange={(event) => updateField("experience", event.target.value)}
                    placeholder="Paste roles, achievements, metrics, projects, or responsibilities."
                    className="min-h-32 resize-none rounded-lg border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">Education</span>
                  <textarea
                    value={form.education}
                    onChange={(event) => updateField("education", event.target.value)}
                    placeholder="Degree, school, graduation year, coursework, honors, or certifications."
                    className="min-h-28 resize-none rounded-lg border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
              disabled={step === 0}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.08] px-5 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => (step < resumeSteps.length - 1 ? setStep(step + 1) : handleGenerateResume())}
              disabled={isLoading || (step === resumeSteps.length - 1 && !canGenerate)}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 text-sm font-extrabold text-ink shadow-neon transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step < resumeSteps.length - 1 ? "Next" : isLoading ? "Optimizing Resume..." : "Generate Resume"}
              <Sparkles size={18} />
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100">
              <AlertCircle className="mt-0.5 shrink-0" size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-white/10 bg-slate-50 p-4 text-slate-950 sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Resume Preview</p>
              <h3 className="mt-1 text-2xl font-black">{resume?.fullName || form.fullName || "Your Name"}</h3>
              <p className="mt-1 text-sm text-slate-600">{resume?.contact || form.contact || "Contact details"}</p>
            </div>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={!resume}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={17} />
              Download PDF
            </button>
          </div>

          {resume ? (
            <div className="grid gap-5 text-sm leading-6">
              <section>
                <h4 className="text-xs font-black uppercase tracking-wide text-slate-500">Professional Summary</h4>
                <p className="mt-2 text-slate-800">{resume.summary}</p>
              </section>
              <section>
                <h4 className="text-xs font-black uppercase tracking-wide text-slate-500">Skills</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {resume.skills.map((skill) => (
                    <span key={skill} className="rounded-lg bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
              <section>
                <h4 className="text-xs font-black uppercase tracking-wide text-slate-500">Experience</h4>
                <ul className="mt-2 grid gap-2">
                  {resume.experience.map((item) => (
                    <li key={item} className="pl-1 text-slate-800">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h4 className="text-xs font-black uppercase tracking-wide text-slate-500">Education</h4>
                <ul className="mt-2 grid gap-2">
                  {resume.education.map((item) => (
                    <li key={item} className="pl-1 text-slate-800">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ) : (
            <div className="grid min-h-[430px] place-items-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
              <div>
                <FileText className="mx-auto text-cyan-600" size={42} />
                <p className="mt-4 text-sm font-bold text-slate-700">Your AI-optimized resume will appear here.</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">Fill out each step and generate a polished preview before downloading the PDF.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SocialPostGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [platform, setPlatform] = useState("LinkedIn");
  const [post, setPost] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate(event) {
    event.preventDefault();
    setError("");
    setCopied(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ topic, tone, platform })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate post.");
      }

      setPost(data.post);
    } catch (generationError) {
      setError(generationError.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!post) {
      return;
    }

    await navigator.clipboard.writeText(post);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section id="social-generator" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="grid gap-6 rounded-lg border border-white/10 bg-white/[0.05] p-4 shadow-neon backdrop-blur sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <div>
          <p className="text-sm font-bold uppercase text-roseGlow">AI Social Media Post Generator</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl">Turn an idea into a ready-to-post caption</h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Choose a tone and platform, then generate a polished social post with a hook, call to action, and relevant hashtags.
          </p>

          <form onSubmit={handleGenerate} className="mt-7 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-200">Topic</span>
              <input
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                maxLength={180}
                placeholder="Example: launching a new AI productivity app"
                className="min-h-12 rounded-lg border border-white/10 bg-ink/70 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-200">Tone</span>
                <select
                  value={tone}
                  onChange={(event) => setTone(event.target.value)}
                  className="min-h-12 rounded-lg border border-white/10 bg-ink/70 px-4 text-sm capitalize text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                >
                  {tones.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-200">Platform</span>
                <select
                  value={platform}
                  onChange={(event) => setPlatform(event.target.value)}
                  className="min-h-12 rounded-lg border border-white/10 bg-ink/70 px-4 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                >
                  {platforms.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-400 to-fuchsia-500 px-5 py-3 text-sm font-extrabold text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate"}
              <Sparkles size={18} />
            </button>
          </form>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100">
              <AlertCircle className="mt-0.5 shrink-0" size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex min-h-[360px] flex-col rounded-lg border border-white/10 bg-ink/70 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Generated Post</p>
              <p className="mt-1 text-xs text-slate-400">Copy it directly into your content calendar.</p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!post}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.08] px-3 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? <CheckCircle2 size={16} className="text-limeGlow" /> : <Clipboard size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <textarea
            value={post || (isLoading ? "Generating your post..." : "")}
            readOnly
            placeholder="Your generated post will appear here."
            className="min-h-[260px] flex-1 resize-none rounded-lg border border-white/10 bg-white/[0.045] p-4 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-500"
          />
        </div>
      </div>
    </section>
  );
}

function App() {
  const [activeTool, setActiveTool] = useState("resume-builder");
  const [currentUser, setCurrentUser] = useState(() => getStoredSession());

  function handleLogout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setCurrentUser(null);
  }

  if (!currentUser) {
    return <AuthPage onAuthenticated={setCurrentUser} />;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-ink text-slate-100">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.20),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(251,113,133,0.15),transparent_26%),radial-gradient(circle_at_55%_85%,rgba(163,230,53,0.12),transparent_30%)]" />
      <div className="relative z-10">
        <Nav user={currentUser} onLogout={handleLogout} />

        <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100">
                <Sparkles size={16} className="text-cyanGlow" />
                Fast, focused, browser-based AI
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-fuchsia-300/25 bg-fuchsia-300/10 px-3 py-2 text-sm font-bold text-fuchsia-100">
                <Crown size={16} className="text-roseGlow" />
                Free Trial Active: 2 Months Remaining
              </div>
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              Free Instant AI Tools
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A compact dashboard of practical micro-tools for creating resumes, editing images, and writing social posts without friction.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#tools"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 text-sm font-extrabold text-ink shadow-neon transition hover:bg-cyan-200"
              >
                Explore Tools
                <ArrowRight size={18} />
              </a>
              <a
                href="#features"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.08] px-5 py-3 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/[0.12]"
              >
                See What Is New
              </a>
            </div>
          </div>

          <div id="features" className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-neon backdrop-blur sm:p-5">
            <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="text-sm font-semibold text-cyan-100">Today&apos;s workspace</p>
              <p className="mt-3 text-4xl font-black text-white">3</p>
              <p className="mt-1 text-sm text-slate-300">AI tools ready to launch</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <p className="text-2xl font-black text-limeGlow">0s</p>
                <p className="mt-1 text-xs font-medium text-slate-300">setup time</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <p className="text-2xl font-black text-roseGlow">24/7</p>
                <p className="mt-1 text-xs font-medium text-slate-300">access</p>
              </div>
            </div>
          </div>
        </section>

        <section id="tools" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase text-cyanGlow">Micro-tool dashboard</p>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Choose a tool and start instantly</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-300">
              Simple, focused cards keep the dashboard fast to scan on desktop and comfortable to use on mobile.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isActive={activeTool === tool.id}
                onUseTool={setActiveTool}
              />
            ))}
          </div>
        </section>

        <ActiveToolView activeTool={activeTool} />

        <PremiumToolsWorkspace />
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
