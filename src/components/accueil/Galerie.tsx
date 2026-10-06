import Image from "next/image";
import { useTranslations } from "next-intl";

// Mosaïque : 2 colonnes en mobile, 12 en desktop. Chaque photo indique ses lignes de début/fin
// (col-[1/3] = de la ligne 1 à la ligne 3, donc 2 colonnes de large), comme dans la maquette.
const photos = [
  { cle: "patio", photo: "1750859513748-90ad9625f1ae", place: "col-[1/3] row-[1/3] lg:col-[1/8] lg:row-[1/3]" },
  { cle: "porte", photo: "1600367639022-c602b26cfc77", place: "col-[1/2] row-[3/4] lg:col-[8/13] lg:row-[1/2]" },
  {
    cle: "terrasse",
    photo: "1702211374779-792e3df71b59",
    place: "col-[2/3] row-[3/5] lg:col-[8/11] lg:row-[2/4] rounded-arch",
  },
  {
    cle: "petitDejeuner",
    photo: "1786799445505-77b51a75ee1f",
    place: "col-[1/2] row-[4/5] lg:col-[11/13] lg:row-[2/3]",
  },
  { cle: "hammam", photo: "1659614536075-2cf8f82cf9db", place: "col-[1/2] row-[5/6] lg:col-[1/5] lg:row-[3/4]" },
  { cle: "indigo", photo: "1527760127628-23c37a0c9af9", place: "col-[2/3] row-[5/6] lg:col-[5/8] lg:row-[3/4]" },
  { cle: "ruelle", photo: "1705765279482-9a1e39811843", place: "col-[1/3] row-[6/8] lg:col-[11/13] lg:row-[3/4]" },
] as const;

export default function Galerie() {
  const t = useTranslations("Accueil.galerie");

  return (
    <section className="flex flex-col gap-8 pt-section">
      <h2 className="px-gutter text-right font-display text-h2 font-medium text-balance">{t("titre")}</h2>
      <div className="grid auto-rows-[150px] grid-cols-2 gap-2 lg:auto-rows-[300px] lg:grid-cols-12">
        {photos.map((p) => (
          <div key={p.cle} className={`relative overflow-hidden bg-placeholder ${p.place}`}>
            <Image src={p.photo} alt={t(p.cle)} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
