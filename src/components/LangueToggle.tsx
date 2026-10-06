"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { cheminLangue } from "@/i18n/site";

const langues = ["fr", "en"] as const;

// De vrais liens <a> : la page se recharge complètement au changement de langue.
// Le script du thème s'exécute donc avant l'affichage, sans flash.
// On reste sur la même page : /chambres/safran ↔ /en/chambres/safran.
export default function LangueToggle({ pilule = false }: { pilule?: boolean }) {
  const locale = useLocale();
  const chemin = usePathname(); // sans le préfixe de langue

  return (
    <div className={pilule ? "flex rounded-full border border-footer-line p-0.75" : "flex gap-1.5"}>
      {langues.map((code) => {
        const actif = code === locale;
        return (
          <a
            key={code}
            href={cheminLangue(code, chemin)}
            hrefLang={code}
            aria-current={actif ? "true" : undefined}
            className={
              pilule
                ? `grid h-10 w-14 place-items-center rounded-full text-sm font-semibold uppercase ${
                    actif ? "bg-footer-text text-footer-bg" : ""
                  }`
                : `text-sm uppercase ${actif ? "font-semibold" : "font-medium text-muted"}`
            }
          >
            {code}
          </a>
        );
      })}
    </div>
  );
}
