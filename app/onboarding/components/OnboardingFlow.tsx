"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { journal } from "@/data/mockData";

type Q1State = 0 | 1 | 2 | 3; // 0=line1 alone, 1=line2 alone, 2=line3 alone, 3=all + form
type Step = "q1" | "q2" | "loading" | "reveal";

const LINE1 = "Hey there, I'm Mira.";
const LINE2 = "Before we work together, I want to learn how you think.";
const LINE3 = "Paste something you've written for work lately. Anything will do, as long as it's yours.";

const FADE_DURATION = 0.5;

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

  useEffect(() => {
    const delays: Record<Q1State, number | null> = {
      0: 3000,
      1: 2500,
      2: 2500,
      3: null,
    };
    const delay = delays[q1State];
    if (delay === null) return;
    const t = setTimeout(
      () => setQ1State((prev) => (prev < 3 ? ((prev + 1) as Q1State) : prev)),
      delay
    );
    return () => clearTimeout(t);
  }, [q1State]);

  return (
    <AnimatePresence mode="wait">
      {q1State === 0 && (
        <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: FADE_DURATION, ease: "easeInOut" }}>
          <p className="font-serif font-medium text-ink" style={{ fontSize: "3.75rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {LINE1}
          </p>
        </motion.div>
      )}

      {q1State === 1 && (
        <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: FADE_DURATION, ease: "easeInOut" }}>
          <p className="font-serif font-medium text-ink" style={{ fontSize: "2.25rem", lineHeight: 1.2, letterSpacing: "-0.015em" }}>
            {LINE2}
          </p>
        </motion.div>
      )}

      {q1State === 2 && (
        <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: FADE_DURATION, ease: "easeInOut" }}>
          <p className="font-serif text-ink" style={{ fontSize: "1.5rem", lineHeight: 1.4, letterSpacing: "-0.01em" }}>
            {LINE3}
          </p>
        </motion.div>
      )}

      {q1State === 3 && (
        <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: FADE_DURATION, ease: "easeInOut" }} className="flex flex-col gap-6">
          <p className="font-serif font-medium text-ink" style={{ fontSize: "3.75rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {LINE1}
          </p>
          <p className="font-serif font-medium text-ink" style={{ fontSize: "2.25rem", lineHeight: 1.2, letterSpacing: "-0.015em" }}>
            {LINE2}
          </p>
          <p className="font-serif text-muted" style={{ fontSize: "1.5rem", lineHeight: 1.4, letterSpacing: "-0.01em" }}>
            {LINE3}
          </p>

          <div className="flex flex-col gap-4 mt-4">
            <textarea
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: FADE_DURATION, ease: "easeInOut" }} className="flex flex-col gap-6">
      <p className="font-serif font-medium text-ink" style={{ fontSize: "2.25rem", lineHeight: 1.2, letterSpacing: "-0.015em" }}>
        One more.
      </p>
      <p className="font-serif text-muted" style={{ fontSize: "1.5rem", lineHeight: 1.4 }}>
        What&apos;s a decision from the last year you&apos;re still thinking about?
        Win or loss, doesn&apos;t matter. A sentence is fine; a paragraph is better.
      </p>

      <div className="flex flex-col gap-4 mt-4">
        <textarea
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: FADE_DURATION, ease: "easeInOut" }} className="flex flex-col gap-4">
      <p className="font-serif text-subhead text-muted">
        Got it. Give me a few seconds.
      </p>
      <motion.p
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="font-serif font-medium text-ink"
        style={{ fontSize: "3.75rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}
      >
        Mira
      </motion.p>
    </motion.div>
  );
}

function RevealScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: FADE_DURATION, ease: "easeInOut" }} className="flex flex-col gap-10">
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
              <span
                key={vp.phrase}
                className="font-serif italic text-body text-ink border border-solid border-hairline rounded-full px-3 py-1"
              >
                {vp.phrase}
              </span>
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
