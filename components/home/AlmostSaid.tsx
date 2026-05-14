"use client";

import { motion, AnimatePresence } from "framer-motion";

interface AlmostSaidProps {
  text: string;
  reason: string;
  visible: boolean;
}

export default function AlmostSaid({ text, reason, visible }: AlmostSaidProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mt-4 mb-2"
        >
          <span className="font-serif text-body text-ink">{text}</span>
          <span className="block font-sans text-meta text-muted-light italic mt-1">
            {reason}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
