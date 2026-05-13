"use client";

import { useEffect, useState, useCallback } from "react";
import type { Sentence } from "@/data/mockData";

interface CardCompositionProps {
  sentences: Sentence[];
  cardIndex: number;
  compositionKey: number;
  onFirstSentence?: () => void;
}

const SENTENCE_GAP = 600;
const CARD_GAP = 1200;

export default function CardComposition({
  sentences,
  cardIndex,
  compositionKey,
  onFirstSentence,
}: CardCompositionProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  const revealAll = useCallback(() => {
    setVisibleCount(sentences.length);
  }, [sentences.length]);

  useEffect(() => {
    const handleScroll = () => revealAll();
    window.addEventListener("wheel", handleScroll, { once: true, passive: true });
    window.addEventListener("touchmove", handleScroll, { once: true, passive: true });
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [revealAll, compositionKey]);

  useEffect(() => {
    setVisibleCount(0);
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const startDelay = cardIndex * CARD_GAP;

    sentences.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleCount((c) => Math.max(c, i + 1));
        if (cardIndex === 0 && i === 0 && onFirstSentence) {
          setTimeout(onFirstSentence, 250);
        }
      }, startDelay + i * SENTENCE_GAP);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
    // compositionKey intentionally in deps to re-trigger on replay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compositionKey]);

  return (
    <div>
      {sentences.map((sentence, i) => (
        <p
          key={i}
          className={`font-serif text-body mb-4 sentence ${
            sentence.accent ? "text-accent" : "text-ink"
          } ${i < visibleCount ? "sentence-visible" : ""}`}
          style={{
            opacity: i < visibleCount ? 1 : 0,
            transition: "opacity 400ms ease",
          }}
        >
          {renderText(sentence.text)}
        </p>
      ))}
    </div>
  );
}

function renderText(text: string): React.ReactNode {
  const parts = text.split(/("(?:[^"\\]|\\.)*")/g);
  return parts.map((part, i) =>
    part.startsWith('"') && part.endsWith('"') ? (
      <em key={i} className="sentence-em">{part}</em>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
