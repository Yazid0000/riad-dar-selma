import { useTranslations } from "next-intl";
import Apparition from "../Apparition";

type Avis = { citation: string; auteur: string; pays: string };

export default function Avis() {
  const t = useTranslations("Accueil.avis");
  const [vedette, ...autres]: Avis[] = t.raw("liste");

  return (
    <section className="flex flex-col gap-12 px-gutter py-section">
      <Apparition>
        <h2 className="font-display text-h2-small font-medium">{t("titre")}</h2>
      </Apparition>
      <Apparition>
        <figure className="flex flex-col gap-6 border-t border-text pt-8">
          <blockquote className="max-w-[18ch] font-display text-quote-large text-balance">
            {vedette.citation}
          </blockquote>
          <figcaption className="text-muted">
            <strong className="font-semibold text-text">{vedette.auteur}</strong>, {vedette.pays}
          </figcaption>
        </figure>
      </Apparition>
      <div className="grid gap-x-gap lg:grid-cols-2">
        {autres.map((a, i) => (
          <Apparition key={a.auteur} delai={i * 0.08}>
            <figure className="flex flex-col gap-3 border-t border-line py-6">
              <blockquote className="font-display text-quote text-pretty">{a.citation}</blockquote>
              <figcaption className="text-[15px] text-muted">
                <strong className="font-semibold text-text">{a.auteur}</strong>, {a.pays}
              </figcaption>
            </figure>
          </Apparition>
        ))}
      </div>
    </section>
  );
}
