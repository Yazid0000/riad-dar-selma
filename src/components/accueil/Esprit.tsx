import { useTranslations } from "next-intl";
import Apparition from "../Apparition";

type Chiffre = { valeur: string; libelle: string };

export default function Esprit() {
  const t = useTranslations("Accueil.esprit");
  // t.raw renvoie la valeur brute du JSON, ici un tableau.
  const chiffres: Chiffre[] = t.raw("chiffres");

  return (
    <section className="grid items-start gap-gap-large px-gutter py-section lg:grid-cols-[3fr_9fr]">
      <Apparition className="pt-3.5 text-xs font-semibold tracking-[0.16em] text-muted uppercase">
        {t("label")}
      </Apparition>
      <div className="flex flex-col gap-gap-large">
        <Apparition>
          <p className="font-display text-statement text-pretty">{t("texte")}</p>
        </Apparition>
        <div className="grid grid-cols-3 gap-gap">
          {chiffres.map((c, i) => (
            <Apparition key={c.valeur} delai={i * 0.08} className="flex flex-col gap-2 border-t border-text pt-4">
              <span className="font-display text-figure font-medium">{c.valeur}</span>
              <span className="text-sm text-muted">{c.libelle}</span>
            </Apparition>
          ))}
        </div>
      </div>
    </section>
  );
}
