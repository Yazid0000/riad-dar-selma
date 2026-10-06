import Image from "next/image";
import { useTranslations } from "next-intl";
import Apparition from "../Apparition";

// Grille « bento » : 2 colonnes, 3 rangées. Les cases se placent toutes seules dans l'ordre,
// on indique seulement celles qui s'étendent sur 2 colonnes (col-span) ou 2 rangées (row-span).
const cases = [
  { cle: "table", photo: "1748540459503-19efc015143b", place: "col-span-2 lg:col-span-1 lg:row-span-2" },
  { cle: "hammam", photo: "1740744931699-11d1db68c0d4", place: "" },
  { cle: "terrasse", photo: "1624805098931-098c0d918b34", place: "lg:row-span-2 rounded-arch" },
  { cle: "excursions", photo: "1534003085889-5e1870403fdc", place: "col-span-2 lg:col-span-1" },
] as const;

export default function Experiences() {
  const t = useTranslations("Accueil.experiences");

  return (
    <section id="experiences" className="flex flex-col gap-gap-large bg-bg-2 px-gutter py-section">
      <Apparition>
        <h2 className="font-display text-h2 font-medium">{t("titre")}</h2>
      </Apparition>
      <div className="grid grid-cols-[3fr_2fr] grid-rows-[300px_240px_200px] gap-gap-small lg:grid-cols-[7fr_5fr] lg:grid-rows-[340px_280px_260px]">
        {cases.map((c, i) => (
          // Les cases apparaissent l'une après l'autre (80 ms d'écart) ; la terrasse en arche se révèle de bas en haut.
          <Apparition
            key={c.cle}
            delai={i * 0.08}
            arche={c.cle === "terrasse"}
            className={`relative flex items-end overflow-hidden bg-placeholder ${c.place}`}
          >
            <Image
              src={c.photo}
              alt={t(`${c.cle}.photo`)}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            {/* Dégradé sombre en bas pour que le texte blanc reste lisible sur la photo. */}
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-linear-to-b from-[rgb(8_10_18/0)] via-[rgb(8_10_18/0.6)] to-[rgb(8_10_18/0.85)]" />
            <div className="relative flex flex-col gap-1 px-4 py-3.5 text-white lg:px-6 lg:py-5">
              <h3 className="font-display text-h3 font-medium">{t(`${c.cle}.titre`)}</h3>
              <p className="max-w-[30ch] text-sm leading-[1.45] text-[#ecebe7]">{t(`${c.cle}.texte`)}</p>
            </div>
          </Apparition>
        ))}
      </div>
    </section>
  );
}
