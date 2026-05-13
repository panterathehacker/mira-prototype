import type { Card as CardType } from "@/data/mockData";

function renderText(text: string): React.ReactNode {
  // Wrap double-quoted phrases in <em> for italics
  const parts = text.split(/("(?:[^"\\]|\\.)*")/g);
  return parts.map((part, i) =>
    part.startsWith('"') && part.endsWith('"') ? (
      <em key={i}>{part}</em>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

interface CardProps {
  card: CardType;
  isLast?: boolean;
}

export default function Card({ card, isLast }: CardProps) {
  return (
    <article
      className={`py-10 ${!isLast ? "border-b border-hairline" : ""}`}
    >
      <h3 className="font-serif text-card-title font-medium text-ink mb-4">
        {card.title}
      </h3>

      <div>
        {card.sentences.map((sentence, i) => (
          <p
            key={i}
            className={`font-serif text-body mb-4 ${
              sentence.accent ? "text-accent" : "text-ink"
            }`}
          >
            {renderText(sentence.text)}
          </p>
        ))}
      </div>

      <p className="font-sans italic text-meta text-muted mt-6">
        {card.footer}
      </p>

      <div className="flex items-center gap-6 mt-4">
        {card.actions.map((action) => (
          <button
            key={action}
            className="font-sans text-meta text-muted bg-transparent border-none p-0 cursor-pointer hover:text-ink"
          >
            [{action}]
          </button>
        ))}
      </div>
    </article>
  );
}
