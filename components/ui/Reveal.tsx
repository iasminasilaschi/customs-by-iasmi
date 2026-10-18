"use client";

import { MotionConfig, motion } from "framer-motion";

/**
 * Scroll-into-view fade/rise wrapper. Respects prefers-reduced-motion:
 * MotionConfig drops the rise and keeps a plain fade. (Branching on the
 * setting instead would render different markup on server and client,
 * leaving content stuck at the server's opacity 0.)
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay, ease: [0.21, 0.6, 0.35, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
