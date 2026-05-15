"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import VariantDropdown from "@/components/variants/VariantDropdown";

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
      <div className="relative">
        <div
          onClick={() => setVariantDropdownOpen(!variantDropdownOpen)}
          className="flex items-center gap-1.5 cursor-pointer select-none"
        >
          <motion.span
            animate={{ opacity: [1, 0.65, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="font-serif text-header-mira font-medium text-ink"
          >
            Mira
          </motion.span>
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            animate={{ rotate: variantDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="text-muted-light mt-1"
          >
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>
        <VariantDropdown />
      </div>

      <div className="flex items-center gap-3">
        <span className="font-sans text-subhead text-muted">{formatted}</span>
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
