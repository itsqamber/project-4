import React, { useState, useRef } from "react";
import {
  Sparkles,
  Lock,
  ImageIcon,
  Clapperboard,
  FileText,
  UploadCloud,
  Wand2,
  Clock3,
  Loader2,
  Zap,
  User,
  Briefcase,
  ListChecks,
  Mail,
  Phone,
  Play,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";

/**
 * AI Dashboard — Neon Cyberpunk Edition
 * Single-file drop-in for src/main.jsx (or import as a component).
 * Tailwind CSS required in the host project (JIT / arbitrary values used).
 */

const TABS = [
  { id: "resume", label: "AI Resume Builder", icon: FileText, gated: false },
  { id: "background", label: "AI Background Changer", icon: ImageIcon, gated: true },
  { id: "image", label: "Text to Image", emoji: "✨", icon: Wand2, gated: true },
  { id: "video", label: "Text to Video", emoji: "🎬", icon: Clapperboard, gated: true },
];

const ASPECT_RATIOS = ["1:1 Square", "16:9 Widescreen", "9:16 Portrait", "4:5 Social"];
const DURATIONS = ["4 seconds", "8 seconds", "12 seconds", "20 seconds"];

function GlowBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-fuchsia-500/30 bg-[#0a0618] px-5 py-3 mb-6 shadow-[0_0_25px_-5px_rgba(217,70,239,0.5)]">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-amber-400/10 animate-pulse" />
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-300" fill="currentColor" />
          <span className="text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200">
            Subscription Plan: Premium Trial — 2 Months Free Active
          </span>
        </div>
        <span className="text-[10px] sm:text-xs font-mono px-2 py-1 rounded-full border border-amber-400/40 text-amber-300 bg-amber-400/10">
          ALL SYSTEMS NOMINAL
        </span>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <label className="block text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-300/70 mb-2">
      {children}
    </label>
  );
}

function NeonInput(props) {
  return (
    <input
      {...props}
      className="w-full bg-black/40 border border-fuchsia-500/20 focus:border-cyan-400/70 focus:ring-1 focus:ring-cyan-400/50 outline-none rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors"
    />
  );
}

function NeonTextarea(props) {
  return (
    <textarea
      {...props}
      className="w-full bg-black/40 border border-fuchsia-500/20 focus:border-cyan-400/70 focus:ring-1 focus:ring-cyan-400/50 outline-none rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors resize-none"
    />
  );
}

function NeonSelect({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full bg-black/40 border border-fuchsia-500/20 focus:border-cyan-400/70 outline-none rounded-lg px-3 py-2.5 text-sm text-slate-100 transition-colors"
    >
      {children}
    </select>
  );
}

function LockedButton({ onClick, disabled, loading, label, emoji, colorFrom, colorTo }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold tracking-wide text-black transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
        boxShadow: `0 0 20px -4px ${colorTo}`,
      }}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Lock className="w-3.5 h-3.5" />
      )}
      <span>{loading ? "Processing…" : label}</span>
      {emoji && !loading && <span>{emoji}</span>}
    </button>
  );
}

function LoadingPanel({ text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 border border-dashed border-fuchsia-500/30 rounded-xl bg-black/30">
      <Loader2 className="w-8 h-8 text-cyan-300 animate-spin" />
      <p className="font-mono text-xs tracking-[0.25em] text-cyan-300/80 uppercase">{text}</p>
      <div className="w-48 h-1 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full w-1/2 bg-gradient-to-r from-cyan-400 to-fuchsia-400 animate-[loadbar_1.2s_ease-in-out_infinite]" />
      </div>
      <style>{`
        @keyframes loadbar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

export default function AIDashboard() {
  const [activeTab, setActiveTab] = useState("resume");

  // ---- Resume Builder state ----
  const [profile, setProfile] = useState({ name: "", title: "", email: "", phone: "" });
  const [skills, setSkills] = useState("");
  const [background, setBackground] = useState("");
  const [resumeData, setResumeData] = useState(null);

  const handleGenerateResume = () => {
    // Fully mocked on the frontend — no backend call, no JSON parsing.
    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const summary =
      background.trim().length > 0
        ? background.trim().length > 220
          ? background.trim().slice(0, 220).trim() + "…"
          : background.trim()
        : "A driven professional ready to bring measurable impact to their next role.";

    setResumeData({
      name: profile.name || "Your Name",
      title: profile.title || "Professional Title",
      email: profile.email || "you@email.com",
      phone: profile.phone || "+00 000 000 000",
      summary,
      skills: skillList.length ? skillList : ["Add skills to see them here"],
    });
  };

  // ---- Background Changer state ----
  const [fileName, setFileName] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [bgPrompt, setBgPrompt] = useState("");
  const [bgLoading, setBgLoading] = useState(false);
  const [bgResult, setBgResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFileName(e.dataTransfer.files[0].name);
  };

  const handleReplaceBackground = () => {
    setBgLoading(true);
    setBgResult(null);
    setTimeout(() => {
      setBgLoading(false);
      setBgResult({ prompt: bgPrompt || "cyberpunk alleyway", file: fileName || "uploaded-photo.jpg" });
    }, 2000);
  };

  // ---- Text to Image state ----
  const [imgPrompt, setImgPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0]);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgResult, setImgResult] = useState(null);

  const handleGenerateArt = () => {
    setImgLoading(true);
    setImgResult(null);
    setTimeout(() => {
      setImgLoading(false);
      setImgResult({ prompt: imgPrompt || "a neon-drenched city skyline", ratio: aspectRatio });
    }, 2000);
  };

  // ---- Text to Video state ----
  const [vidPrompt, setVidPrompt] = useState("");
  const [duration, setDuration] = useState(DURATIONS[0]);
  const [vidLoading, setVidLoading] = useState(false);
  const [vidResult, setVidResult] = useState(null);

  const handleRenderClip = () => {
    setVidLoading(true);
    setVidResult(null);
    setTimeout(() => {
      setVidLoading(false);
      setVidResult({ prompt: vidPrompt || "a slow pan across a rain-soaked megacity", duration });
    }, 2000);
  };

  const ratioBoxClass = (r) => {
    if (r.startsWith("1:1")) return "aspect-square";
    if (r.startsWith("16:9")) return "aspect-video";
    if (r.startsWith("9:16")) return "aspect-[9/16] max-w-[220px] mx-auto";
    return "aspect-[4/5] max-w-[260px] mx-auto";
  };

  return (
    <div
      className="min-h-screen w-full text-slate-100 px-4 py-6 sm:px-8 sm:py-8"
      style={{
        background:
          "radial-gradient(circle at 15% 10%, rgba(0,240,255,0.08), transparent 40%), radial-gradient(circle at 85% 90%, rgba(255,0,229,0.08), transparent 40%), #05020e",
        fontFamily: "'Rajdhani', 'Inter', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Orbitron', sans-serif; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <GlowBanner />

        <header className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300">
            AI Studio Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">Craft your resume and generate premium AI media, all in one place.</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-fuchsia-500/15 pb-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                  active
                    ? "text-black bg-gradient-to-r from-cyan-400 to-fuchsia-400 shadow-[0_0_18px_-3px_rgba(0,240,255,0.6)]"
                    : "text-slate-300 hover:text-cyan-300 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.emoji && <span>{tab.emoji}</span>}
                {tab.gated && !active && <Lock className="w-3 h-3 text-amber-400 ml-1" />}
              </button>
            );
          })}
        </div>

        {/* ---------------- RESUME BUILDER ---------------- */}
        {activeTab === "resume" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5 rounded-2xl border border-cyan-400/15 bg-white/[0.02] p-5">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2">
                <User className="w-4 h-4" /> Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <SectionLabel>Full Name</SectionLabel>
                  <NeonInput
                    placeholder="Ayesha Khan"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <SectionLabel>Title</SectionLabel>
                  <NeonInput
                    placeholder="Frontend Engineer"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  />
                </div>
                <div>
                  <SectionLabel>Email</SectionLabel>
                  <NeonInput
                    placeholder="ayesha@email.com"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div>
                  <SectionLabel>Phone</SectionLabel>
                  <NeonInput
                    placeholder="+92 300 0000000"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
              </div>

              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2 pt-2">
                <ListChecks className="w-4 h-4" /> Skills
              </h2>
              <div>
                <SectionLabel>Comma-separated</SectionLabel>
                <NeonInput
                  placeholder="React, TypeScript, Node.js, UI Design"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2 pt-2">
                <Briefcase className="w-4 h-4" /> Background
              </h2>
              <div>
                <SectionLabel>Experience summary</SectionLabel>
                <NeonTextarea
                  rows={5}
                  placeholder="Describe your work history, achievements, and what you're looking for next…"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                />
              </div>

              <button
                onClick={handleGenerateResume}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold tracking-wide text-black bg-gradient-to-r from-cyan-400 to-emerald-300 shadow-[0_0_20px_-4px_rgba(52,211,153,0.6)] transition-transform active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                Generate Resume
              </button>
            </div>

            {/* Resume Preview */}
            <div className="rounded-2xl border border-fuchsia-400/15 bg-white/[0.02] p-5 min-h-[420px]">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-fuchsia-300 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Live Preview
              </h2>

              {!resumeData ? (
                <div className="flex flex-col items-center justify-center text-center gap-2 py-20 border border-dashed border-white/10 rounded-xl">
                  <FileText className="w-8 h-8 text-slate-600" />
                  <p className="text-sm text-slate-500">Fill in your details and click Generate Resume.</p>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0b0720] to-[#120a2e] shadow-[0_0_35px_-10px_rgba(217,70,239,0.4)]">
                  <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10">
                    <p className="font-display text-xl font-bold text-white">{resumeData.name}</p>
                    <p className="text-sm text-cyan-300">{resumeData.title}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {resumeData.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {resumeData.phone}</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-fuchsia-300 mb-1.5">Summary</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{resumeData.summary}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-fuchsia-300 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((s, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-full border border-cyan-400/30 text-cyan-200 bg-cyan-400/5"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-300 pt-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> AI-optimized for readability and impact
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- BACKGROUND CHANGER ---------------- */}
        {activeTab === "background" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5 rounded-2xl border border-cyan-400/15 bg-white/[0.02] p-5">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyan-300">Upload Image</h2>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-14 px-4 text-center transition-colors ${
                  dragActive ? "border-cyan-400 bg-cyan-400/5" : "border-fuchsia-500/25 hover:border-fuchsia-400/50"
                }`}
              >
                <UploadCloud className="w-8 h-8 text-fuchsia-300" />
                <p className="text-sm text-slate-300">
                  {fileName ? fileName : "Drag & drop an image, or click to browse"}
                </p>
                <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setFileName(e.target.files[0].name)}
                />
              </div>

              <div>
                <SectionLabel>Background prompt</SectionLabel>
                <NeonInput
                  placeholder="cyberpunk alleyway with neon signs"
                  value={bgPrompt}
                  onChange={(e) => setBgPrompt(e.target.value)}
                />
              </div>

              <LockedButton
                onClick={handleReplaceBackground}
                loading={bgLoading}
                label="Replace Background"
                emoji="✨"
                colorFrom="#22d3ee"
                colorTo="#d946ef"
              />
            </div>

            <div className="rounded-2xl border border-fuchsia-400/15 bg-white/[0.02] p-5 min-h-[420px]">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-fuchsia-300 mb-4">Result</h2>
              {bgLoading && <LoadingPanel text="Repainting Background…" />}
              {!bgLoading && !bgResult && (
                <div className="flex flex-col items-center justify-center text-center gap-2 py-20 border border-dashed border-white/10 rounded-xl">
                  <ImageIcon className="w-8 h-8 text-slate-600" />
                  <p className="text-sm text-slate-500">Your before / after will appear here.</p>
                </div>
              )}
              {!bgLoading && bgResult && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-[11px] text-center mt-2 text-slate-500 font-mono uppercase tracking-wider">Original</p>
                  </div>
                  <div>
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-cyan-600 via-fuchsia-600 to-purple-800 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_25px_-6px_rgba(217,70,239,0.6)]">
                      <Sparkles className="w-8 h-8 text-white/80" />
                    </div>
                    <p className="text-[11px] text-center mt-2 text-cyan-300 font-mono uppercase tracking-wider">
                      "{bgResult.prompt}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- TEXT TO IMAGE ---------------- */}
        {activeTab === "image" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5 rounded-2xl border border-cyan-400/15 bg-white/[0.02] p-5">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyan-300">Prompt</h2>
              <NeonTextarea
                rows={6}
                placeholder="A neon-drenched city skyline at midnight, cinematic, ultra-detailed…"
                value={imgPrompt}
                onChange={(e) => setImgPrompt(e.target.value)}
              />
              <div>
                <SectionLabel>Aspect Ratio</SectionLabel>
                <NeonSelect value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                  {ASPECT_RATIOS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </NeonSelect>
              </div>
              <LockedButton
                onClick={handleGenerateArt}
                loading={imgLoading}
                label="Generate Art"
                emoji="🎨"
                colorFrom="#a855f7"
                colorTo="#22d3ee"
              />
            </div>

            <div className="rounded-2xl border border-fuchsia-400/15 bg-white/[0.02] p-5 min-h-[420px] flex flex-col">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-fuchsia-300 mb-4">Result</h2>
              {imgLoading && <LoadingPanel text="Rendering Pixels…" />}
              {!imgLoading && !imgResult && (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-20 border border-dashed border-white/10 rounded-xl">
                  <Wand2 className="w-8 h-8 text-slate-600" />
                  <p className="text-sm text-slate-500">Your generated artwork will appear here.</p>
                </div>
              )}
              {!imgLoading && imgResult && (
                <div>
                  <div
                    className={`${ratioBoxClass(imgResult.ratio)} rounded-xl bg-gradient-to-br from-fuchsia-600 via-purple-700 to-cyan-500 border border-fuchsia-400/40 flex items-center justify-center shadow-[0_0_35px_-8px_rgba(168,85,247,0.6)] relative overflow-hidden`}
                  >
                    <Sparkles className="w-10 h-10 text-white/70" />
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-cyan-200">
                      {imgResult.ratio}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 italic">"{imgResult.prompt}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- TEXT TO VIDEO ---------------- */}
        {activeTab === "video" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5 rounded-2xl border border-cyan-400/15 bg-white/[0.02] p-5">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyan-300">Cinematic Prompt</h2>
              <NeonTextarea
                rows={6}
                placeholder="A slow pan across a rain-soaked megacity, flying cars, holographic billboards…"
                value={vidPrompt}
                onChange={(e) => setVidPrompt(e.target.value)}
              />
              <div>
                <SectionLabel>Duration</SectionLabel>
                <NeonSelect value={duration} onChange={(e) => setDuration(e.target.value)}>
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </NeonSelect>
              </div>
              <LockedButton
                onClick={handleRenderClip}
                loading={vidLoading}
                label="Render Clip"
                emoji="🎬"
                colorFrom="#f472b6"
                colorTo="#818cf8"
              />
            </div>

            <div className="rounded-2xl border border-fuchsia-400/15 bg-white/[0.02] p-5 min-h-[420px] flex flex-col">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-fuchsia-300 mb-4 flex items-center gap-2">
                <Clock3 className="w-4 h-4" /> Result
              </h2>
              {vidLoading && <LoadingPanel text="Compositing Frames…" />}
              {!vidLoading && !vidResult && (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-20 border border-dashed border-white/10 rounded-xl">
                  <Clapperboard className="w-8 h-8 text-slate-600" />
                  <p className="text-sm text-slate-500">Your rendered clip will appear here.</p>
                </div>
              )}
              {!vidLoading && vidResult && (
                <div>
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 border border-indigo-400/40 flex items-center justify-center shadow-[0_0_35px_-8px_rgba(99,102,241,0.6)] relative">
                    <button className="w-14 h-14 rounded-full bg-black/40 border border-white/30 flex items-center justify-center hover:bg-black/60 transition-colors">
                      <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
                    </button>
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-cyan-200">
                      {vidResult.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 italic">"{vidResult.prompt}"</p>
                  <button
                    onClick={handleRenderClip}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" /> Re-render
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}