"use client";

import { useTranslations } from "next-intl";
import Icone from "./Icone";

// Les deux icônes sont superposées ([grid-area:1/1]). Selon la classe "dark" de <html>, l'une est
// visible et l'autre tournée, réduite et transparente. Quand la classe change, la transition CSS
// fait tourner la lune vers la sortie pendant que le soleil arrive (et inversement).
// Tailwind v4 écrit rotate-90 et scale-50 dans les propriétés CSS « rotate » et « scale » (pas « transform ») :
// ce sont elles qu'il faut animer.
// Au chargement, le script du layout pose la classe avant l'affichage : rien ne bouge.
const anime =
  "[grid-area:1/1] size-5 transition-[rotate,scale,opacity] duration-400 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none";

export default function ThemeToggle() {
  const t = useTranslations("Theme");

  const basculer = () => {
    const sombre = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", sombre ? "dark" : "light");
  };

  // Les libellés lus par les lecteurs d'écran suivent aussi la classe "dark", sans attendre React.
  return (
    <button
      type="button"
      onClick={basculer}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition-transform duration-150 active:scale-97"
    >
      <Icone nom="dark_mode" className={`${anime} dark:scale-50 dark:rotate-90 dark:opacity-0`} />
      <Icone
        nom="light_mode"
        className={`${anime} scale-50 -rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100`}
      />
      <span className="sr-only dark:hidden">{t("sombre")}</span>
      <span className="sr-only hidden dark:inline">{t("clair")}</span>
    </button>
  );
}
