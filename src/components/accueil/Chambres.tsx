import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { rooms } from "@/data/rooms";
import Carrousel from "./Carrousel";

// Tailles des cartes de la maquette, dans l'ordre des chambres : [mobile, desktop] en px.
// Les décalages verticaux (haut) créent le rythme irrégulier de la rangée.
const formats = [
  { largeur: [260, 440], hauteur: [340, 580], haut: [0, 0], arche: true },
  { largeur: [200, 320], hauteur: [250, 420], haut: [40, 120], arche: false },
  { largeur: [240, 400], hauteur: [300, 520], haut: [12, 40], arche: true },
  { largeur: [210, 300], hauteur: [260, 400], haut: [48, 160], arche: false },
  { largeur: [230, 360], hauteur: [290, 480], haut: [20, 80], arche: true },
  { largeur: [300, 560], hauteur: [380, 640], haut: [0, 0], arche: true },
];

export default function Chambres() {
  const t = useTranslations("Accueil.chambres");

  return (
    <section id="chambres" className="flex flex-col gap-14 pb-section lg:gap-22">
      <Carrousel
        titre={<h2 className="font-display text-h2 font-medium">{t("titre")}</h2>}
        precedent={t("precedent")}
        suivant={t("suivant")}
      >
        {rooms.map((chambre, i) => {
          const f = formats[i];
          return (
            <Link
              key={chambre.slug}
              href={`/chambres/${chambre.slug}`}
              // Variables CSS lues par les classes w-(--l) lg:w-(--ld)… : une valeur mobile, une desktop.
              style={
                {
                  "--l": `${f.largeur[0]}px`,
                  "--ld": `${f.largeur[1]}px`,
                  "--h": `${f.hauteur[0]}px`,
                  "--hd": `${f.hauteur[1]}px`,
                  "--m": `${f.haut[0]}px`,
                  "--md": `${f.haut[1]}px`,
                } as React.CSSProperties
              }
              className="mt-(--m) flex w-(--l) shrink-0 snap-start flex-col gap-3.5 lg:mt-(--md) lg:w-(--ld)"
            >
              <div
                className={`relative h-(--h) overflow-hidden bg-placeholder lg:h-(--hd) ${f.arche ? "rounded-arch" : ""}`}
              >
                <Image
                  src={chambre.photo}
                  alt={t("photo", { nom: chambre.nom })}
                  fill
                  sizes={`(min-width: 1024px) ${f.largeur[1]}px, ${f.largeur[0]}px`}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between gap-x-3 gap-y-1 lg:flex-row lg:items-baseline">
                <span className="font-display text-h3 font-medium">{chambre.nom}</span>
                <span className="text-sm whitespace-nowrap text-muted">
                  {t("details", { capacite: chambre.capacite, prix: chambre.prix })}
                </span>
              </div>
            </Link>
          );
        })}
      </Carrousel>
    </section>
  );
}
