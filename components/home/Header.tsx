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

      <div className="flex items-center gap-4">
        <span className="font-sans text-body text-ink">{formatted}</span>
        <button
          onClick={() => setJournalOpen(true)}
          className="font-sans text-meta bg-[#EDEAE4] text-muted hover:bg-[#E4E0D8] hover:text-ink px-3 py-1.5 rounded-sm transition-all duration-150 cursor-pointer border-none"
        >
          Journal
        </button>
      </div>
    </header>
  );
}
