"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { easeMaquette } from "../Apparition";

// Mobile uniquement : barre « Demander une réservation » fixée en bas, une fois le hero dépassé.
// Elle disparaît quand le bandeau final (#reserver), qui a son propre bouton, arrive à l'écran.
export default function BarreReservation() {
  const t = useTranslations("Nav");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mettreAJour = () => {
      const appel = document.getElementById("reserver");
      const avantAppel = !appel || appel.getBoundingClientRect().top > window.innerHeight;
      setVisible(window.scrollY > window.innerHeight * 0.85 && avantAppel);
    };
    mettreAJour();
    window.addEventListener("scroll", mettreAJour, { passive: true });
    return () => window.removeEventListener("scroll", mettreAJour);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-anime
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: easeMaquette }}
          className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-bg/95 px-gutter pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
        >
          <Link href="/contact" className="bouton h-12 w-full">
            {t("reserver")}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
