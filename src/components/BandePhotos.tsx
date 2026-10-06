"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Photo = { cle: string; photo: string; alt: string; largeur: number[] };

// Bande de photos qui défile ; un clic ouvre la photo en plein écran.
// <dialog> est natif : showModal() bloque le reste de la page, Échap le ferme, le focus est géré.
export default function BandePhotos({ photos, fermer }: { photos: Photo[]; fermer: string }) {
  const dialogue = useRef<HTMLDialogElement>(null);
  const [ouverte, setOuverte] = useState<Photo | null>(null);

  const ouvrir = (p: Photo) => {
    setOuverte(p);
    dialogue.current?.showModal();
  };

  return (
    <>
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-gutter scrollbar-none">
        {photos.map((p) => (
          <button
            key={p.cle}
            type="button"
            onClick={() => ouvrir(p)}
            aria-haspopup="dialog"
            style={{ "--l": `${p.largeur[0]}px`, "--ld": `${p.largeur[1]}px` } as React.CSSProperties}
            className="relative h-55 w-(--l) shrink-0 cursor-zoom-in snap-start bg-placeholder transition-[opacity,transform] duration-200 hover:opacity-86 active:scale-[0.98] lg:h-95 lg:w-(--ld)"
          >
            <Image
              src={p.photo}
              alt={p.alt}
              fill
              sizes={`(min-width: 1024px) ${p.largeur[1]}px, ${p.largeur[0]}px`}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogue}
        onClose={() => setOuverte(null)}
        // Un clic à côté de la photo (sur le fond du dialogue) ferme aussi.
        onClick={(e) => e.target === e.currentTarget && dialogue.current?.close()}
        className="m-auto h-[90dvh] w-[92vw] max-w-none bg-transparent backdrop:bg-black/85"
      >
        {ouverte && <Image src={ouverte.photo} alt={ouverte.alt} fill sizes="92vw" className="object-contain" />}
        <button
          type="button"
          onClick={() => dialogue.current?.close()}
          autoFocus
          className="absolute top-3 right-3 h-11 rounded-full bg-white/90 px-4.5 text-[15px] font-medium text-black"
        >
          {fermer}
        </button>
      </dialog>
    </>
  );
}
