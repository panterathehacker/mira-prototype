"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { journal } from "@/data/mockData";

type Q1State = 0 | 1 | 2 | 3;
type Step = "q1" | "q2" | "loading" | "reveal";

const LINE1 = "Hey there, I'm Mira.";
const LINE2 = "Before we work together, I want to learn how you think.";
const LINE3 = "Paste something you've written for work lately. Anything will do, as long as it's yours.";

// ─── Text extraction ──────────────────────────────────────────────────────────

async function extractText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "pdf") {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = await Promise.all(
      Array.from({ length: pdf.numPages }, async (_, i) => {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();
        return content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
      })
    );
    return pages.join("\n\n");
  }

  if (ext === "docx") {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  // Plain text fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) ?? "");
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// ─── Main flow ────────────────────────────────────────────────────────────────

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>("q1");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const router = useRouter();

  function handleQ1() {
    if (!q1.trim()) return;
    setStep("q2");
  }

  function handleQ2() {
    if (!q2.trim()) return;
    setStep("loading");
  }

  useEffect(() => {
    if (step === "loading") {
      const t = setTimeout(() => setStep("reveal"), 9000);
      return () => clearTimeout(t);
    }
  }, [step]);

  function handleStart() {
    setTransitioning(true);
    setTimeout(() => router.push("/"), 550);
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-12 relative">
      <div className="w-full max-w-[680px]">
        <AnimatePresence mode="wait">
          {step === "q1" && (
            <Q1Screen key="q1" value={q1} onChange={setQ1} onContinue={handleQ1} />
          )}
          {step === "q2" && (
            <Q2Screen key="q2" value={q2} onChange={setQ2} onContinue={handleQ2} />
          )}
          {step === "loading" && <LoadingScreen key="loading" />}
          {step === "reveal" && (
            <RevealScreen key="reveal" onStart={handleStart} />
          )}
        </AnimatePresence>
      </div>

      {/* Page-transition overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-paper z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <button
        onClick={() => router.push("/")}
        className="fixed bottom-8 right-8 font-sans text-meta text-muted-light hover:text-muted transition-colors duration-150"
      >
        skip
      </button>
    </div>
  );
}

// ─── Shared upload button ─────────────────────────────────────────────────────

function ActionLink({
  onClick,
  disabled = false,
  dimmed = false,
  children,
  title,
}: {
  onClick?: () => void;
  disabled?: boolean;
  dimmed?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || dimmed}
      title={title}
      className={`
        font-sans text-meta px-3 py-1.5 rounded-sm transition-all duration-150 border-none
        ${
          dimmed || disabled
            ? "bg-[#F0EDE8] text-muted-light cursor-not-allowed"
            : "bg-[#EDEAE4] text-muted hover:bg-[#E4E0D8] hover:text-ink cursor-pointer"
        }
      `}
    >
      {children}
    </button>
  );
}

// ─── Q1 ──────────────────────────────────────────────────────────────────────

function Q1Screen({
  value,
  onChange,
  onContinue,
}: {
  value: string;
  onChange: (v: string) => void;
  onContinue: () => void;
}) {
  const [q1State, setQ1State] = useState<Q1State>(0);
  const [extracting, setExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const delays: (number | null)[] = [2000, 2500, 2500, null];
    const delay = delays[q1State];
    if (delay === null) return;
    const t = setTimeout(
      () => setQ1State((p) => Math.min(p + 1, 3) as Q1State),
      delay
    );
    return () => clearTimeout(t);
  }, [q1State]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtracting(true);
    try {
      const text = await extractText(file);
      onChange(text);
    } catch {
      onChange("(Could not extract text automatically — paste the content directly.)");
    } finally {
      setExtracting(false);
      e.target.value = "";
    }
  }

  return (
    <AnimatePresence mode="wait">
      {q1State === 0 && (
        <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
          <p className="font-serif font-medium text-ink" style={{ fontSize: "3.75rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {LINE1}
          </p>
        </motion.div>
      )}

      {q1State === 1 && (
        <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
          <p className="font-serif font-medium text-ink" style={{ fontSize: "2.25rem", lineHeight: 1.2, letterSpacing: "-0.015em" }}>
            {LINE2}
          </p>
        </motion.div>
      )}

      {q1State === 2 && (
        <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
          <p className="font-serif text-ink" style={{ fontSize: "1.5rem", lineHeight: 1.4, letterSpacing: "-0.01em" }}>
            {LINE3}
          </p>
        </motion.div>
      )}

      {q1State === 3 && (
        <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="flex flex-col gap-6">
          <p className="font-serif font-medium text-ink" style={{ fontSize: "3.75rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {LINE1}
          </p>
          <p className="font-serif font-medium text-ink" style={{ fontSize: "2.25rem", lineHeight: 1.2, letterSpacing: "-0.015em" }}>
            {LINE2}
          </p>
          <p className="font-serif text-muted" style={{ fontSize: "1.5rem", lineHeight: 1.4, letterSpacing: "-0.01em" }}>
            {LINE3}
          </p>

          <div className="flex flex-col gap-4 mt-2">
            <textarea
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onContinue();
                }
              }}
              rows={6}
              placeholder={extracting ? "Extracting text…" : ""}
              className="w-full font-serif text-body text-ink bg-transparent border-b border-solid border-hairline outline-none resize-none placeholder:text-muted-light py-3"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.pdf,.docx,text/*"
                  onChange={handleFile}
                  className="hidden"
                />
                <ActionLink onClick={() => fileInputRef.current?.click()} disabled={extracting}>
                  {extracting ? "Extracting…" : "Upload from computer"}
                </ActionLink>
                <ActionLink dimmed title="Coming soon">
                  Import from Drive
                </ActionLink>
              </div>

              <button
                onClick={onContinue}
                disabled={!value.trim()}
                className="font-sans text-body text-ink disabled:text-muted-light hover:underline underline-offset-4 transition-all duration-150 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Q2 ──────────────────────────────────────────────────────────────────────

function Q2Screen({
  value,
  onChange,
  onContinue,
}: {
  value: string;
  onChange: (v: string) => void;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col gap-6"
    >
      <p className="font-serif font-medium text-ink" style={{ fontSize: "2.25rem", lineHeight: 1.2, letterSpacing: "-0.015em" }}>
        One more thing.
      </p>
      <p className="font-serif text-muted" style={{ fontSize: "1.5rem", lineHeight: 1.4 }}>
        What&apos;s a decision from the last year you&apos;re still thinking about?
        Win or loss, doesn&apos;t matter.
      </p>
      <p className="font-serif text-muted-light" style={{ fontSize: "1rem", lineHeight: 1.5 }}>
        This is how I start learning what matters to you.
      </p>

      <div className="flex flex-col gap-4 mt-2">
        <textarea
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onContinue();
            }
          }}
          rows={6}
          className="w-full font-serif text-body text-ink bg-transparent border-b border-solid border-hairline outline-none resize-none placeholder:text-muted-light py-3"
        />
        <div className="flex justify-end">
          <button
            onClick={onContinue}
            disabled={!value.trim()}
            className="font-sans text-body text-ink disabled:text-muted-light hover:underline underline-offset-4 transition-all duration-150 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Loading ──────────────────────────────────────────────────────────────────

const LOADING_LINES = [
  "Reading your writing.",
  "Spotting your patterns.",
  "Building a model of how you think.",
];
const LOADING_FOOTER = "The longer we work together, the sharper this gets.";

function LoadingScreen() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const timings = [0, 1800, 3600];
    const timers = timings.map((delay, i) =>
      setTimeout(() => setVisible((v) => Math.max(v, i + 1)), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col gap-5"
    >
      {LOADING_LINES.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: i < visible ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-serif font-medium text-ink"
          style={{
            fontSize: `${2.25 - i * 0.5}rem`,
            lineHeight: 1.2,
            letterSpacing: "-0.015em",
          }}
        >
          {line}
        </motion.p>
      ))}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: visible >= 3 ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="font-serif italic text-muted-light"
        style={{ fontSize: "1rem", lineHeight: 1.5, marginTop: "0.5rem" }}
      >
        {LOADING_FOOTER}
      </motion.p>
    </motion.div>
  );
}

// ─── Reveal ───────────────────────────────────────────────────────────────────

function VoiceTag({ phrase, note }: { phrase: string; note: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <span className="font-sans text-meta text-ink border border-solid border-hairline rounded-full px-3 py-1.5 cursor-default select-none">
        {note}
      </span>
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 font-serif italic text-meta text-ink bg-paper border border-solid border-hairline px-2 py-1 rounded whitespace-nowrap z-10 block"
          >
            &ldquo;{phrase}&rdquo;
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function RevealScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="flex flex-col gap-10"
    >
      <div className="flex flex-col gap-2">
        <p className="font-serif text-subhead text-muted">
          Here&apos;s what I&apos;ve got so far. I&apos;ll keep working on it as we go.
        </p>
        <p className="font-serif text-subhead text-muted-light">
          You can edit this later. The more we work together, the more I&apos;ll refine it.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <span className="font-sans text-meta text-muted-light uppercase tracking-widest">
            How I see your thesis
          </span>
          <p className="font-serif text-body text-ink">{journal.thesis}</p>
        </div>

        <div className="border-t border-solid border-hairline pt-6 flex flex-col gap-3">
          <span className="font-sans text-meta text-muted-light uppercase tracking-widest">
            Your voice
          </span>
          <div className="flex flex-wrap gap-2">
            {journal.voicePhrases.map((vp) => (
              <VoiceTag key={vp.phrase} phrase={vp.phrase} note={vp.note} />
            ))}
          </div>
        </div>

        <div className="border-t border-solid border-hairline pt-6 flex flex-col gap-3">
          <span className="font-sans text-meta text-muted-light uppercase tracking-widest">
            What I&apos;m still figuring out
          </span>
          {journal.figuringOut.map((q, i) => (
            <p key={i} className="font-serif italic text-body text-muted">
              — {q.text}
            </p>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onStart}
          className="font-sans text-body text-ink hover:underline underline-offset-4 transition-all duration-150"
        >
          Let&apos;s start →
        </button>
      </div>
    </motion.div>
  );
}
