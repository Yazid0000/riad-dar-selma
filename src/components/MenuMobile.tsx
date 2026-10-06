"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Lien = { href: string; label: string };

export default function MenuMobile({ liens }: { liens: Lien[] }) {
  const t = useTranslations("Nav");
  const [ouvert, setOuvert] = useState(false);
  const fermer = () => setOuvert(false);

  // Échap ferme le menu.
  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [ouvert]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(!ouvert)}
        aria-expanded={ouvert}
        aria-controls="menu-mobile"
        className="h-11 rounded-full border border-line px-4.5 text-[15px] font-medium"
      >
        {ouvert ? t("fermer") : t("menu")}
      </button>

      {ouvert && (
        <nav
          id="menu-mobile"
          className="fixed inset-x-0 top-18 bottom-0 z-20 flex flex-col gap-4 bg-bg px-gutter py-10 font-display text-[40px] font-medium tracking-[-0.03em]"
        >
          {liens.map((lien) => (
            <Link key={lien.href} href={lien.href} onClick={fermer}>
              {lien.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={fermer}
            className="mt-6 grid h-14 place-items-center rounded-full bg-accent font-sans text-base font-semibold tracking-normal text-on-accent"
          >
            {t("reserver")}
          </Link>
        </nav>
      )}
    </>
  );
}
