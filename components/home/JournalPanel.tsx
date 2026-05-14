"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

function VoiceTag({ phrase, note }: { phrase: string; note: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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

export default function JournalPanel() {
  const journalOpen = useStore((s) => s.journalOpen);
  const setJournalOpen = useStore((s) => s.setJournalOpen);
  const journal = useStore((s) => s.journal);

  return (
    <AnimatePresence>
      {journalOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setJournalOpen(false)}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(10, 10, 10, 0.15)" }}
          />

          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 h-full w-[440px] bg-paper z-50 overflow-y-auto"
            style={{ boxShadow: "-4px 0 40px rgba(92, 122, 158, 0.14)" }}
          >
            <div className="px-10 py-10 flex flex-col gap-8">

              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-sans text-meta text-muted-light uppercase tracking-widest">
                  Mira&apos;s Journal
                </span>
                <button
                  onClick={() => setJournalOpen(false)}
                  className="font-sans text-meta bg-[#EDEAE4] text-muted hover:bg-[#E4E0D8] hover:text-ink px-3 py-1.5 rounded-sm transition-all duration-150 cursor-pointer border-none"
                >
                  Close
                </button>
              </div>

              {/* Thesis */}
              <div className="flex flex-col gap-3">
                <span className="font-sans text-meta text-muted-light uppercase tracking-widest">
                  How I see your thesis
                </span>
                <p className="font-serif text-body text-ink leading-relaxed">
                  {journal.thesis}
                </p>
              </div>

              {/* Voice */}
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

              {/* Figuring out */}
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
