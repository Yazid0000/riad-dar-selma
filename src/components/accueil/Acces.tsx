import { useTranslations } from "next-intl";
import { riad } from "@/data/riad";
import Icone, { type NomIcone } from "../Icone";

const etapes: { cle: "aeroport" | "parking" | "arrivee"; icone: NomIcone }[] = [
  { cle: "aeroport", icone: "flight_land" },
  { cle: "parking", icone: "local_parking" },
  { cle: "arrivee", icone: "luggage" },
];

const { latitude: lat, longitude: lon } = riad;
// Cadre de la carte OpenStreetMap. Le riad est placé à 31 % depuis la gauche,
// pour rester visible à côté de la carte d'infos qui recouvre la droite en desktop.
const cadre = [lon - 0.0093, lat - 0.006, lon + 0.0207, lat + 0.006].join(",");
const carte = `https://www.openstreetmap.org/export/embed.html?bbox=${cadre}&layer=mapnik&marker=${lat},${lon}`;
const plans = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

export default function Acces() {
  const t = useTranslations("Accueil.acces");

  return (
    <section id="acces" className="grid px-gutter pb-section lg:grid-cols-12">
      <iframe
        src={carte}
        title={t("carte")}
        loading="lazy"
        className="h-80 w-full border-0 bg-placeholder lg:col-span-full lg:row-start-1 lg:h-160"
      />
      <div className="flex flex-col gap-5 bg-bg pt-7 lg:col-[8/13] lg:row-start-1 lg:mr-10 lg:self-center lg:p-10">
        <span className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">{t("label")}</span>
        <h2 className="font-display text-h2-small font-medium">{t("titre")}</h2>
        <p className="text-[15px] text-muted">{t("adresse")}</p>
        <ul>
          {etapes.map((e) => (
            <li key={e.cle} className="grid grid-cols-[36px_minmax(0,1fr)] gap-2.5 border-t border-line py-3.5">
              <Icone nom={e.icone} className="size-6 text-accent" />
              <span className="flex flex-col text-[15px]">
                <strong className="font-semibold">{t(`${e.cle}.titre`)}</strong>
                <span className="text-muted">{t(`${e.cle}.texte`)}</span>
              </span>
            </li>
          ))}
        </ul>
        <a
          href={plans}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] font-semibold text-accent underline underline-offset-4"
        >
          {t("plans")}
        </a>
      </div>
    </section>
  );
}
