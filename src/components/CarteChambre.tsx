import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Room } from "@/data/rooms";

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
      className="mt-(--m) flex w-(--l) shrink-0 snap-start flex-col gap-3.5 lg:mt-(--md) lg:w-(--ld)"
    >
      <div className={`relative h-(--h) overflow-hidden bg-placeholder lg:h-(--hd) ${arche ? "rounded-arch" : ""}`}>
        <Image
          src={chambre.photo}
          alt={alt}
          fill
          sizes={`(min-width: 1024px) ${px(largeur[1], kl)}, ${px(largeur[0], kl)}`}
          className="object-cover"
        />
      </div>
      {children}
    </Link>
  );
}
