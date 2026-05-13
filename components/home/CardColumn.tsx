import { cards } from "@/data/mockData";
import Card from "./Card";

export default function CardColumn() {
  return (
    <div>
      {cards.map((card, i) => (
        <Card key={card.id} card={card} isLast={i === cards.length - 1} />
      ))}
    </div>
  );
}
