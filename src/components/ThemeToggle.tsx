"use client";

import { useTranslations } from "next-intl";

export default function ThemeToggle() {
  const t = useTranslations("Theme");

  const basculer = () => {
    const sombre = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", sombre ? "dark" : "light");
  };

  // Les deux libellés sont dans le HTML. Le CSS affiche le bon selon la classe "dark",
  // dès le premier affichage, sans attendre React.
  return (
    <button
      type="button"
      onClick={basculer}
      className="h-11 rounded-full border border-line px-4.5 text-[15px] font-medium"
    >
      <span className="dark:hidden">{t("sombre")}</span>
      <span className="hidden dark:inline">{t("clair")}</span>
    </button>
  );
}
