import React from "react";
import { createRoot } from "react-dom/client";
import { FileText, ImageOff, Megaphone, Sparkles, ArrowRight, Zap } from "lucide-react";
import "./styles.css";

const tools = [
  {
    title: "AI Resume Builder",
    description: "Create a polished, job-ready resume with smart phrasing and clean formatting in minutes.",
    icon: FileText,
    shadow: "shadow-neon",
    iconClass: "text-cyanGlow",
    ringClass: "ring-cyanGlow/25",
    buttonClass: "from-cyan-400 to-blue-500"
  },
  {
    title: "Image Background Remover",
    description: "Remove photo backgrounds instantly for product shots, profiles, thumbnails, and campaigns.",
    icon: ImageOff,
    shadow: "shadow-neon-lime",
    iconClass: "text-limeGlow",
    ringClass: "ring-limeGlow/25",
    buttonClass: "from-lime-300 to-emerald-500"
  },
  {
    title: "AI Social Media Post Generator",
    description: "Turn a quick idea into scroll-stopping captions, hooks, and post variations for any channel.",
    icon: Megaphone,
    shadow: "shadow-neon-rose",
    iconClass: "text-roseGlow",
    ringClass: "ring-roseGlow/25",
    buttonClass: "from-rose-400 to-fuchsia-500"
  }
];

function Nav() {
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

        <a
          href="#tools"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
        >
          Launch
          <Zap size={16} />
        </a>
      </nav>
    </header>
  );
}

function ToolCard({ tool }) {
  const Icon = tool.icon;

  return (
    <article
      className={`group flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.055] p-5 ${tool.shadow} transition duration-300 hover:-translate-y-1 hover:border-white/20 sm:p-6`}
    >
      <div className={`mb-6 grid size-12 place-items-center rounded-lg bg-white/10 ring-1 ${tool.ringClass}`}>
        <Icon className={tool.iconClass} size={24} strokeWidth={2.2} />
      </div>
      <h3 className="text-xl font-semibold leading-tight text-white">{tool.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{tool.description}</p>
      <a
        href="#"
        className={`mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${tool.buttonClass} px-4 py-3 text-sm font-bold text-ink transition group-hover:brightness-110`}
      >
        Use Tool
        <ArrowRight size={17} />
      </a>
    </article>
  );
}

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-ink text-slate-100">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.20),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(251,113,133,0.15),transparent_26%),radial-gradient(circle_at_55%_85%,rgba(163,230,53,0.12),transparent_30%)]" />
      <div className="relative z-10">
        <Nav />

        <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100">
              <Sparkles size={16} className="text-cyanGlow" />
              Fast, focused, browser-based AI
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
              <ToolCard key={tool.title} tool={tool} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
