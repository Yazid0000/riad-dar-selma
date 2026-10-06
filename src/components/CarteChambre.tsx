import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Room } from "@/data/rooms";
import Apparition from "./Apparition";

// Carte d'une chambre dans une rangée qui défile : photo au format de la maquette + légende (children).
// echelle « reduite » = rangée « Les autres chambres » (largeur ×0,75, hauteur ×0,7, décalage ×0,6).
export default function CarteChambre({
  chambre,
  alt,
  echelle = "normale",
  children,
}: {
  chambre: Room;
  alt: string;
  echelle?: "normale" | "reduite";
  children: React.ReactNode;
}) {
  const { largeur, hauteur, haut, arche } = chambre.carte;
  const [kl, kh, km] = echelle === "reduite" ? [0.75, 0.7, 0.6] : [1, 1, 1];
  const px = (v: number, k: number) => `${Math.round(v * k)}px`;
  const photo = (
    <Image
      src={chambre.photo}
      alt={alt}
      fill
      sizes={`(min-width: 1024px) ${px(largeur[1], kl)}, ${px(largeur[0], kl)}`}
      className="object-cover"
    />
  );

  return (
    <Link
      href={`/chambres/${chambre.slug}`}
      // Variables CSS lues par les classes w-(--l) lg:w-(--ld)… : une valeur mobile, une desktop.
      style={
        {
          "--l": px(largeur[0], kl),
          "--ld": px(largeur[1], kl),
          "--h": px(hauteur[0], kh),
          "--hd": px(hauteur[1], kh),
          "--m": px(haut[0], km),
          "--md": px(haut[1], km),
        } as React.CSSProperties
      }
      // Survol (souris seulement) : la carte pâlit. Toucher / clic : léger enfoncement.
      className="mt-(--m) flex w-(--l) shrink-0 snap-start flex-col gap-3.5 transition-[opacity,transform] duration-200 hover:opacity-86 active:scale-[0.98] lg:mt-(--md) lg:w-(--ld)"
    >
      {arche ? (
        // Les photos en arche se révèlent de bas en haut quand elles arrivent à l'écran.
        <Apparition arche className="relative h-(--h) overflow-hidden rounded-arch bg-placeholder lg:h-(--hd)">
          {photo}
        </Apparition>
      ) : (
        <div className="relative h-(--h) overflow-hidden bg-placeholder lg:h-(--hd)">{photo}</div>
      )}
      {children}
    </Link>
  );
}
