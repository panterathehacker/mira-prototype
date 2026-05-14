"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { cards as mockCards } from "@/data/mockData";
import Card from "./Card";

const SENTENCE_GAP = 600;
const CARD_BUFFER = 600;

function computeStartDelay(cardIndex: number): number {
  let delay = 0;
  for (let i = 0; i < cardIndex; i++) {
    delay += mockCards[i].sentences.length * SENTENCE_GAP + CARD_BUFFER;
  }
  return delay;
}

export default function CardColumn() {
  const compositionKey = useStore((s) => s.compositionKey);
  const hasPlayedChime = useStore((s) => s.hasPlayedChime);
  const setHasPlayedChime = useStore((s) => s.setHasPlayedChime);
  const [allRevealed, setAllRevealed] = useState(false);

  useEffect(() => {
    setAllRevealed(false);
    const reveal = () => setAllRevealed(true);
    window.addEventListener("wheel", reveal, { once: true, passive: true });
    window.addEventListener("touchmove", reveal, { once: true, passive: true });
    return () => {
      window.removeEventListener("wheel", reveal);
      window.removeEventListener("touchmove", reveal);
    };
  }, [compositionKey]);

  function handleFirstSentence() {
    if (hasPlayedChime) return;
    setHasPlayedChime();
    const audio = new Audio("/sounds/chime.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  return (
    <div className="flex flex-col gap-4">
      {mockCards.map((card, i) => (
        <Card
          key={card.id}
          card={card}
          cardIndex={i}
          compositionKey={compositionKey}
          startDelay={computeStartDelay(i)}
          allRevealed={allRevealed}
          onFirstSentence={i === 0 ? handleFirstSentence : undefined}
        />
      ))}
    </div>
  );
}
