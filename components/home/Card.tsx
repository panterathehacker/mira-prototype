"use client";

import { useState, useRef } from "react";
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
  isLast?: boolean;
  onFirstSentence?: () => void;
}

export default function Card({
  card,
  cardIndex,
  compositionKey,
  isLast,
  onFirstSentence,
}: CardProps) {
  const [almostSaidVisible, setAlmostSaidVisible] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setPushBackActive = useStore((s) => s.setPushBackActive);
  const pushBackActive = useStore((s) => s.pushBackActive);
  const storeCards = useStore((s) => s.cards);
  const storeCard = storeCards.find((c) => c.id === card.id) ?? card;

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

  return (
    <motion.article
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -2, boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`py-10 ${!isLast ? "border-b border-solid border-hairline" : ""}`}
    >
      <h3 className="font-serif text-card-title font-medium text-ink mb-4">
        {card.title}
      </h3>

      <CardComposition
        sentences={card.sentences}
        cardIndex={cardIndex}
        compositionKey={compositionKey}
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

      <div className="flex items-center mt-5" style={{ gap: "1.5rem" }}>
        {card.actions.map((action, i) => (
          <motion.button
            key={action}
            whileHover="hover"
            onClick={() => handleAction(action)}
            className="font-sans text-meta text-muted hover:text-ink transition-colors duration-150 bg-transparent border-none p-0 cursor-pointer relative tracking-wide"
          >
            {action}
            <motion.span
              variants={{ hover: { width: "100%" }, initial: { width: 0 } }}
              initial="initial"
              className="absolute bottom-[-1px] left-0 h-px bg-ink"
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </motion.button>
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
      <div className="flex gap-4 mt-2">
        <button onClick={handleSubmit} className="font-sans text-meta text-muted hover:text-ink">
          [Send]
        </button>
        <button onClick={onClose} className="font-sans text-meta text-muted hover:text-ink">
          [Cancel]
        </button>
      </div>
    </motion.div>
  );
}
