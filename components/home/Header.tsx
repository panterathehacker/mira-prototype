"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

export default function Header() {
  const date = new Date();
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const setVariantDropdownOpen = useStore((s) => s.setVariantDropdownOpen);
  const variantDropdownOpen = useStore((s) => s.variantDropdownOpen);
  const setJournalOpen = useStore((s) => s.setJournalOpen);

  return (
    <header className="flex items-baseline justify-between py-8">
      <motion.span
        onClick={() => setVariantDropdownOpen(!variantDropdownOpen)}
        animate={{ opacity: [1, 0.65, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="font-serif text-header-mira font-medium text-ink cursor-pointer select-none"
      >
        Mira
      </motion.span>

      <div className="flex items-center gap-2 font-sans text-meta">
        <span className="text-muted">{formatted}</span>
        <span className="text-muted-light select-none">·</span>
        <button
          onClick={() => setJournalOpen(true)}
          className="text-ink font-medium hover:text-muted bg-transparent border-none p-0 cursor-pointer transition-colors duration-150"
        >
          Journal
        </button>
      </div>
    </header>
  );
}
