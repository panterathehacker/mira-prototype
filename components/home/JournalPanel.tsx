"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

function VoiceTag({ phrase, note, source }: { phrase: string; note: string; source: string }) {
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
            className="absolute bottom-full left-0 mb-2 font-serif italic text-meta text-muted bg-paper border border-solid border-hairline px-2 py-1 rounded whitespace-nowrap z-10 block"
          >
            &ldquo;{phrase}&rdquo; &mdash; {source}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function WeighIn({ index, existingNote }: { index: number; existingNote?: string }) {
  const weighInOnQuestion = useStore((s) => s.weighInOnQuestion);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    weighInOnQuestion(index, trimmed);
    setValue("");
    setOpen(false);
  }

  if (existingNote) {
    return (
      <div className="mt-2 pl-3 border-l-2 border-solid border-hairline">
        <p className="font-serif text-meta text-muted leading-relaxed">{existingNote}</p>
        <button
          onClick={() => setOpen(true)}
          className="font-sans text-meta text-muted-light hover:text-accent transition-colors duration-150 cursor-pointer border-none bg-transparent underline underline-offset-2 mt-1"
        >
          Update
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 mt-2"
            >
              <textarea
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
                  if (e.key === "Escape") { setOpen(false); setValue(""); }
                }}
                placeholder="Revise your take."
                rows={2}
                className="font-serif text-meta text-ink bg-paper border border-solid border-hairline rounded px-3 py-2 resize-none outline-none focus:border-accent transition-colors duration-150 w-full"
              />
              <div className="flex items-center gap-3">
                <button onClick={handleSubmit} className="font-sans text-meta bg-[#EDEAE4] text-muted hover:bg-[#E4E0D8] hover:text-ink px-3 py-1.5 rounded-sm transition-all duration-150 cursor-pointer border-none">Submit</button>
                <button onClick={() => { setOpen(false); setValue(""); }} className="font-sans text-meta text-muted-light hover:text-muted transition-colors duration-150 cursor-pointer border-none bg-transparent">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="mt-1">
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2"
          >
            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
                if (e.key === "Escape") { setOpen(false); setValue(""); }
              }}
              placeholder="What's your take?"
              rows={2}
              className="font-serif text-meta text-ink bg-paper border border-solid border-hairline rounded px-3 py-2 resize-none outline-none focus:border-accent transition-colors duration-150 w-full"
            />
            <div className="flex items-center gap-3">
              <button onClick={handleSubmit} className="font-sans text-meta bg-[#EDEAE4] text-muted hover:bg-[#E4E0D8] hover:text-ink px-3 py-1.5 rounded-sm transition-all duration-150 cursor-pointer border-none">Submit</button>
              <button onClick={() => { setOpen(false); setValue(""); }} className="font-sans text-meta text-muted-light hover:text-muted transition-colors duration-150 cursor-pointer border-none bg-transparent">Cancel</button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(true)}
            className="font-sans text-meta text-muted-light hover:text-accent transition-colors duration-150 cursor-pointer border-none bg-transparent underline underline-offset-2"
          >
            Weigh in
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function JournalPanel() {
  const journalOpen = useStore((s) => s.journalOpen);
  const setJournalOpen = useStore((s) => s.setJournalOpen);
  const journal = useStore((s) => s.journal);
  const updateJournalThesis = useStore((s) => s.updateJournalThesis);

  const [thesisConfirmed, setThesisConfirmed] = useState(false);
  const [thesisEditing, setThesisEditing] = useState(false);
  const thesisRef = useRef<HTMLParagraphElement>(null);

  function handleThesisBlur() {
    setThesisEditing(false);
    const newText = thesisRef.current?.innerText.trim() ?? "";
    if (newText && newText !== journal.thesis) {
      updateJournalThesis(newText);
      setThesisConfirmed(true);
      setTimeout(() => setThesisConfirmed(false), 2500);
    }
  }

  function handleThesisKeyDown(e: React.KeyboardEvent<HTMLParagraphElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      thesisRef.current?.blur();
    }
    if (e.key === "Escape") {
      thesisRef.current?.blur();
    }
  }

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
                <p
                  ref={thesisRef}
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => setThesisEditing(true)}
                  onBlur={handleThesisBlur}
                  onKeyDown={handleThesisKeyDown}
                  className="font-serif text-body text-ink leading-relaxed outline-none cursor-text rounded hover:bg-[#F5F3EF] focus:bg-[#F5F3EF] px-2 py-1 -mx-2 -my-1 transition-colors duration-150"
                >
                  {journal.thesis}
                </p>
                <AnimatePresence mode="wait">
                  {thesisConfirmed ? (
                    <motion.div
                      key="confirmed"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-serif text-body text-accent"
                    >
                      Updated. I&apos;ll factor this in.
                    </motion.div>
                  ) : !thesisEditing ? (
                    <motion.span
                      key="hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="font-sans text-meta text-muted-light"
                    >
                      Click to edit
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Voice */}
              <div className="border-t border-solid border-hairline pt-6 flex flex-col gap-3">
                <span className="font-sans text-meta text-muted-light uppercase tracking-widest">
                  Your voice
                </span>
                <div className="flex flex-wrap gap-2">
                  {journal.voicePhrases.map((vp) => (
                    <VoiceTag key={vp.phrase} phrase={vp.phrase} note={vp.note} source={vp.source} />
                  ))}
                </div>
              </div>

              {/* Figuring out */}
              <div className="border-t border-solid border-hairline pt-6 flex flex-col gap-4">
                <span className="font-sans text-meta text-muted-light uppercase tracking-widest">
                  What I&apos;m still figuring out
                </span>
                {journal.figuringOut.map((q, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <p className="font-serif italic text-body text-muted">
                      — {q.text}
                    </p>
                    <WeighIn index={i} existingNote={q.userNote} />
                  </div>
                ))}
              </div>

            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
