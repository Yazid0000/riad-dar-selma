"use client";

import { useTranslations } from "next-intl";
import Icone from "./Icone";

export default function ThemeToggle() {
  const t = useTranslations("Theme");

  const basculer = () => {
    const sombre = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", sombre ? "dark" : "light");
  };

  // Les deux versions (icône + libellé lu par les lecteurs d'écran) sont dans le HTML.
  // Le CSS affiche la bonne selon la classe "dark", dès le premier affichage, sans attendre React.
  return (
    <button
      type="button"
      onClick={basculer}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition-transform duration-150 active:scale-97"
    >
      <span className="dark:hidden">
        <Icone nom="dark_mode" className="size-5" />
        <span className="sr-only">{t("sombre")}</span>
      </span>
      <span className="hidden dark:inline">
        <Icone nom="light_mode" className="size-5" />
        <span className="sr-only">{t("clair")}</span>
      </span>
    </button>
  );
}
