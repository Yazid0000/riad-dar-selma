"use client";

import { motion } from "motion/react";

// Le contour d'arche du bandeau final se dessine comme au stylo quand il arrive à l'écran.
// Le chemin part du bas à gauche, monte, fait le demi-cercle (rayon 19,25) et redescend à droite.
// pathLength : 0 = rien de tracé, 1 = tracé complet (Motion anime stroke-dasharray pour nous).
export default function ArcheTracee() {
  return (
    <svg width="40" height="56" viewBox="0 0 40 56" fill="none" aria-hidden="true">
      <motion.path
        data-anime
        d="M0.75 56V20A19.25 19.25 0 0 1 39.25 20V56"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        // Courbe « inOut » : le trait accélère puis ralentit, comme une main qui dessine.
        // Le délai laisse d'abord le bandeau finir son fondu.
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
      />
    </svg>
  );
}
