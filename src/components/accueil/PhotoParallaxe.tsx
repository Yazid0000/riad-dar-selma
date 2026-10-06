"use client";

import { motion, useScroll, useTransform } from "motion/react";

// Parallaxe du hero : la photo descend de 0,12 px pour chaque pixel défilé (120 px pour 1000 px),
// elle semble donc défiler plus lentement que la page.
// Le cadre dépasse de 112 px vers le haut (-top-28) pour qu'aucun vide n'apparaisse pendant le mouvement.
export default function PhotoParallaxe({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 120]);

  return (
    <motion.div data-anime style={{ y }} className="absolute inset-x-0 -top-28 bottom-0">
      {children}
    </motion.div>
  );
}
