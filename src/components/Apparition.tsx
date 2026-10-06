"use client";

import { motion } from "motion/react";

// La courbe de la maquette : départ rapide, arrivée très douce.
export const easeMaquette = [0.2, 0.7, 0.2, 1] as const;

// Les animations d'entrée de la maquette, en un seul composant :
// - par défaut : fondu + montée de 24 px, 700 ms, quand 20 % de l'élément est visible ;
// - arche : révélation de bas en haut (clip-path), pour les photos en arche ;
// - auChargement : dès l'affichage de la page, au lieu d'attendre le défilement (900 ms) ;
// - montee={false} : fondu seul.
// delai décale les éléments d'une même série (0.08 = 80 ms entre chaque).
// data-anime : la règle prefers-reduced-motion de globals.css affiche directement l'état final.
export default function Apparition({
  children,
  className = "",
  delai = 0,
  arche = false,
  auChargement = false,
  montee = true,
}: {
  children: React.ReactNode;
  className?: string;
  delai?: number;
  arche?: boolean;
  auChargement?: boolean;
  montee?: boolean;
}) {
  // Haut de page : animation CSS (animate-arche / -entree / -fondu, définies dans globals.css).
  // Le navigateur la lance dès le premier affichage, sans attendre que le JavaScript ait démarré.
  // Avec Motion, le contenu restait invisible tant que React n'était pas prêt (jusqu'à plusieurs
  // secondes sur un téléphone lent).
  if (auChargement) {
    const animation = arche ? "animate-arche" : montee ? "animate-entree" : "animate-fondu";
    return (
      <div data-anime className={`${animation} ${className}`} style={{ animationDelay: `${delai}s` }}>
        {children}
      </div>
    );
  }

  const cache = arche ? { clipPath: "inset(100% 0% 0% 0%)" } : { opacity: 0, y: montee ? 24 : 0 };
  const visible = arche ? { clipPath: "inset(0% 0% 0% 0%)" } : { opacity: 1, y: 0 };

  return (
    <motion.div
      data-anime
      initial={cache}
      whileInView={visible}
      // Une arche encore masquée (clip-path) a une surface visible nulle : le seuil « 20 % visible »
      // ne serait jamais atteint. On la déclenche donc dès qu'elle touche l'écran, mais avec une marge
      // qui retire les 20 % du bas de l'écran : même effet, elle se révèle une fois bien entrée.
      viewport={
        arche ? { once: true, amount: "some" as const, margin: "0px 0px -20% 0px" } : { once: true, amount: 0.2 }
      }
      transition={{ duration: arche ? 0.9 : 0.7, ease: easeMaquette, delay: delai }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
