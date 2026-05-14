"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Card as CardType } from "@/data/mockData";
import CardComposition from "./CardComposition";
import AlmostSaid from "./AlmostSaid";
import { useStore } from "@/lib/store";
import { getResponse } from "@/data/pushBackResponses";

interface CardProps {
  card: CardType;
  cardIndex: number;
  compositionKey: number;
  startDelay: number;
  allRevealed: boolean;
  onFirstSentence?: () => void;
}

export default function Card({
  card,
  cardIndex,
  compositionKey,
  startDelay,
  allRevealed,
  onFirstSentence,
}: CardProps) {
  const [almostSaidVisible, setAlmostSaidVisible] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setPushBackActive = useStore((s) => s.setPushBackActive);
  const pushBackActive = useStore((s) => s.pushBackActive);
  const storeCards = useStore((s) => s.cards);
  const storeCard = storeCards.find((c) => c.id === card.id) ?? card;

  useEffect(() => {
    setIsCardVisible(false);
    if (allRevealed) {
      setIsCardVisible(true);
      return;
    }
    const t = setTimeout(() => setIsCardVisible(true), startDelay);
    return () => clearTimeout(t);
  }, [compositionKey, startDelay, allRevealed]);

  function handleMouseEnter() {
    if (!card.almostSaid) return;
    hoverTimer.current = setTimeout(() => setAlmostSaidVisible(true), 600);
  }

  function handleMouseLeave() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setAlmostSaidVisible(false);
  }

  function handleAction(action: string) {
    const lower = action.toLowerCase();
    if (lower === "push back" || lower === "disagree") {
      setPushBackActive(card.id);
    }
  }

  const isPushBackOpen = pushBackActive === card.id;
  const visible = isCardVisible || allRevealed;

  return (
    <motion.article
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 14,
        boxShadow: visible
          ? "0 2px 20px rgba(92, 122, 158, 0.12)"
          : "0 2px 20px rgba(92, 122, 158, 0.00)",
      }}
      whileHover={visible ? { y: -3, boxShadow: "0 6px 28px rgba(92, 122, 158, 0.20)" } : undefined}
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="bg-paper rounded-md px-8 py-8"
    >
      <h3 className="font-serif text-card-title font-medium text-ink mb-4">
        {card.title}
      </h3>

      <CardComposition
        sentences={card.sentences}
        cardIndex={cardIndex}
        startDelay={startDelay}
        compositionKey={compositionKey}
        allRevealed={allRevealed}
        onFirstSentence={cardIndex === 0 ? onFirstSentence : undefined}
      />

      {card.almostSaid && (
        <AlmostSaid
          text={card.almostSaid.text}
          reason={card.almostSaid.reason}
          visible={almostSaidVisible}
        />
      )}

      {storeCard.pushBackResponse && (
        <div className="mt-3 pl-4 border-l-2 border-solid border-accent">
          <span className="font-sans text-meta text-accent tracking-wide">Updated: </span>
          <span className="font-serif text-body text-ink">{storeCard.pushBackResponse}</span>
        </div>
      )}

      <p className="font-sans italic text-meta text-muted mt-6">{card.footer}</p>

      <div className="flex items-center flex-wrap gap-3 mt-5">
        {card.actions.map((action) => (
          <button
            key={action}
            onClick={() => handleAction(action)}
            className="font-sans text-meta bg-[#EDEAE4] text-muted hover:bg-[#E4E0D8] hover:text-ink px-3 py-1.5 rounded-sm transition-all duration-150 cursor-pointer border-none"
          >
            {action}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isPushBackOpen && (
          <PushBackInput cardId={card.id} onClose={() => setPushBackActive(null)} />
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function PushBackInput({ cardId, onClose }: { cardId: string; onClose: () => void }) {
  const [value, setValue] = useState("");
  const updateCard = useStore((s) => s.updateCardWithPushBack);
  const addQuestion = useStore((s) => s.addJournalQuestion);

  function handleSubmit() {
    if (!value.trim()) return;
    const response = getResponse(value);
    updateCard(cardId, response);
    addQuestion(
      `Re: "${value.slice(0, 60)}${value.length > 60 ? "…" : ""}" — still thinking about what this means for the pattern.`
    );
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mt-6"
    >
      <textarea
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
          if (e.key === "Escape") onClose();
        }}
        placeholder="Tell me where I'm wrong."
        className="w-full font-serif text-body text-ink bg-transparent border-b border-solid border-hairline outline-none resize-none placeholder:text-muted-light py-2"
        rows={2}
      />
      <div className="flex gap-3 mt-3">
        <button
          onClick={handleSubmit}
          className="font-sans text-meta bg-[#EDEAE4] text-muted hover:bg-[#E4E0D8] hover:text-ink px-3 py-1.5 rounded-sm transition-all duration-150 cursor-pointer border-none"
        >
          Send
        </button>
        <button
          onClick={onClose}
          className="font-sans text-meta bg-[#EDEAE4] text-muted hover:bg-[#E4E0D8] hover:text-ink px-3 py-1.5 rounded-sm transition-all duration-150 cursor-pointer border-none"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}
