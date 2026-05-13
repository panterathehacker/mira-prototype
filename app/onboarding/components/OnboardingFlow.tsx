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

const FADE = (duration = 0.5) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration, ease: "easeInOut" as const },
});

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>("q1");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
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
      const t = setTimeout(() => setStep("reveal"), 7000);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-12">
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
            <RevealScreen key="reveal" onStart={() => router.push("/")} />
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={() => router.push("/")}
        className="fixed bottom-8 right-8 font-sans text-meta text-muted-light hover:text-muted transition-colors duration-150"
      >
        skip
      </button>
    </div>
  );
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const delays: (number | null)[] = [2000, 2500, 2500, null];
    const delay = delays[q1State];
    if (delay === null) return;
    const t = setTimeout(
      () => setQ1State((prev) => Math.min(prev + 1, 3) as Q1State),
      delay
    );
    return () => clearTimeout(t);
  }, [q1State]);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      onChange(text);
    };
    reader.readAsText(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  return (
    <AnimatePresence mode="wait">
      {q1State === 0 && (
        <motion.div key="s0" {...FADE()}>
          <p className="font-serif font-medium text-ink" style={{ fontSize: "3.75rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {LINE1}
          </p>
        </motion.div>
      )}

      {q1State === 1 && (
        <motion.div key="s1" {...FADE()}>
          <p className="font-serif font-medium text-ink" style={{ fontSize: "2.25rem", lineHeight: 1.2, letterSpacing: "-0.015em" }}>
            {LINE2}
          </p>
        </motion.div>
      )}

      {q1State === 2 && (
        <motion.div key="s2" {...FADE()}>
          <p className="font-serif text-ink" style={{ fontSize: "1.5rem", lineHeight: 1.4, letterSpacing: "-0.01em" }}>
            {LINE3}
          </p>
        </motion.div>
      )}

      {q1State === 3 && (
        <motion.div key="s3" {...FADE()} className="flex flex-col gap-6">
          <p className="font-serif font-medium text-ink" style={{ fontSize: "3.75rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {LINE1}
          </p>
          <p className="font-serif font-medium text-ink" style={{ fontSize: "2.25rem", lineHeight: 1.2, letterSpacing: "-0.015em" }}>
            {LINE2}
          </p>
          <p className="font-serif text-muted" style={{ fontSize: "1.5rem", lineHeight: 1.4, letterSpacing: "-0.01em" }}>
            {LINE3}
          </p>

          <div className="flex flex-col gap-3 mt-2">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.csv,text/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="font-sans text-meta text-muted hover:text-ink transition-colors duration-150"
                >
                  Upload from computer
                </button>
                <span className="text-muted-light text-meta select-none">·</span>
                <button
                  disabled
                  className="font-sans text-meta text-muted-light cursor-not-allowed"
                  title="Coming soon"
                >
                  Import from Drive
                </button>
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
        Win or loss, doesn&apos;t matter. A sentence is fine; a paragraph is better.
      </p>

      <div className="flex flex-col gap-3 mt-2">
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

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col gap-6"
    >
      <p className="font-serif text-subhead text-muted">
        Got it. Give me a few seconds.
      </p>
      <motion.p
        animate={{ opacity: [1, 1, 0.35, 1, 1] }}
        transition={{
          duration: 4,
          times: [0, 0.25, 0.5, 0.75, 1],
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 0.6,
        }}
        className="font-serif font-medium text-ink"
        style={{ fontSize: "3.75rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}
      >
        Mira
      </motion.p>
    </motion.div>
  );
}

function VoiceTag({ phrase, note }: { phrase: string; note: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="font-sans text-meta text-ink border border-solid border-hairline rounded-full px-3 py-1 cursor-default select-none">
        {note}
      </span>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 z-10"
          >
            <span className="font-serif italic text-meta text-ink bg-paper border border-solid border-hairline px-2 py-1 rounded whitespace-nowrap block">
              &ldquo;{phrase}&rdquo;
            </span>
          </motion.div>
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
      <p className="font-serif text-subhead text-muted">
        Here&apos;s what I&apos;ve got so far. I&apos;ll keep working on it as we go.
      </p>

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
