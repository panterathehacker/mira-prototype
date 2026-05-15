"use client";

import { useEffect, useState } from "react";
import type { Sentence } from "@/data/mockData";

interface CardCompositionProps {
  sentences: Sentence[];
  cardIndex: number;
  startDelay: number;
  compositionKey: number;
  allRevealed: boolean;
  onFirstSentence?: () => void;
}

const SENTENCE_GAP = 600;

export default function CardComposition({
  sentences,
  cardIndex,
  startDelay,
  compositionKey,
  allRevealed,
  onFirstSentence,
}: CardCompositionProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (allRevealed) {
      setVisibleCount(sentences.length);
      return;
    }
    const timeouts: ReturnType<typeof setTimeout>[] = [];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compositionKey, allRevealed]);

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
