export default function Header() {
  const date = new Date();
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="flex items-baseline justify-between py-8">
      <span className="font-serif text-header-mira font-medium text-ink cursor-pointer select-none">
        Mira
      </span>
      <div className="flex items-center gap-6">
        <span className="font-sans text-meta text-muted italic">Journal</span>
        <span className="font-sans text-meta text-muted">{formatted}</span>
      </div>
    </header>
  );
}
