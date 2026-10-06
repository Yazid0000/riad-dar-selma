"use client";

import { useRef } from "react";

// Rangée qui défile horizontalement (scroll-snap natif) + flèches précédent / suivant.
// Les cartes arrivent déjà rendues par le serveur via children.
export default function Carrousel({
  titre,
  precedent,
  suivant,
  children,
}: {
  titre: React.ReactNode;
  precedent: string;
  suivant: string;
  children: React.ReactNode;
}) {
  const rangee = useRef<HTMLDivElement>(null);
  const defiler = (sens: 1 | -1) => rangee.current?.scrollBy({ left: sens * 400, behavior: "smooth" });

  const fleche = "grid size-12 place-items-center rounded-full border border-line text-lg";

  return (
    <>
      <div className="flex items-end justify-between gap-6 px-gutter">
        {titre}
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => defiler(-1)} aria-label={precedent} className={fleche}>
            ←
          </button>
          <button type="button" onClick={() => defiler(1)} aria-label={suivant} className={fleche}>
            →
          </button>
        </div>
      </div>
      <div
        ref={rangee}
        className="flex snap-x snap-mandatory scroll-pl-gutter items-start gap-gap overflow-x-auto px-gutter pb-2 scrollbar-none"
      >
        {children}
      </div>
    </>
  );
}
