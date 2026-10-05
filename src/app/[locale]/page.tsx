import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import ThemeToggle from "@/components/ThemeToggle";

// Page provisoire de la phase 1 : vérifie polices, couleurs, thème sombre et traductions.
export default function Accueil({ params }: PageProps<"/[locale]">) {
  setRequestLocale(use(params).locale);
  const t = useTranslations("Accueil");

  return (
    <main className="flex min-h-dvh flex-col justify-end gap-8 px-gutter pb-section-small">
      <div>
        <ThemeToggle />
      </div>
      <div className="h-80 w-60 rounded-arch bg-placeholder" />
      <h1 className="font-display text-display font-medium text-balance">
        {t.rich("titre", { em: (chunks) => <em className="font-normal">{chunks}</em> })}
      </h1>
      <p className="max-w-[26em] text-lead text-muted">{t("accroche")}</p>
      <div>
        <a
          href="#"
          className="inline-flex h-14 items-center rounded-full bg-accent px-7.5 font-semibold text-on-accent hover:bg-accent-hover"
        >
          {t("reserver")}
        </a>
      </div>
    </main>
  );
}
