"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { cards as mockCards } from "@/data/mockData";
import Card from "./Card";

export default function CardColumn() {
  const compositionKey = useStore((s) => s.compositionKey);
  const hasPlayedChime = useStore((s) => s.hasPlayedChime);
  const setHasPlayedChime = useStore((s) => s.setHasPlayedChime);

  function handleFirstSentence() {
    if (hasPlayedChime) return;
    setHasPlayedChime();
    const audio = new Audio("/sounds/chime.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Autoplay policy may block — silent fail is correct behavior
    });
  }

  // Reset chime on replay so it plays again
  useEffect(() => {
    // compositionKey changes on each replay; chime resets are handled by resetAll
  }, [compositionKey]);

  return (
    <div
      className="bg-paper px-8 rounded-sm"
      style={{ boxShadow: "0 2px 32px rgba(92, 122, 158, 0.10)" }}
    >
      {mockCards.map((card, i) => (
        <Card
          key={card.id}
          card={card}
          cardIndex={i}
          compositionKey={compositionKey}
          isLast={i === mockCards.length - 1}
          onFirstSentence={i === 0 ? handleFirstSentence : undefined}
        />
      ))}
    </div>
  );
}
