import { useTranslations } from "next-intl";
import { rooms } from "@/data/rooms";
import Apparition from "../Apparition";
import CarteChambre from "../CarteChambre";
import Carrousel from "./Carrousel";

export default function Chambres() {
  const t = useTranslations("Accueil.chambres");

  return (
    <section id="chambres" className="pb-section">
      <Apparition className="flex flex-col gap-14 lg:gap-22">
        <Carrousel
          titre={<h2 className="font-display text-h2 font-medium">{t("titre")}</h2>}
          precedent={t("precedent")}
          suivant={t("suivant")}
        >
          {rooms.map((chambre) => (
            <CarteChambre key={chambre.slug} chambre={chambre} alt={t("photo", { nom: chambre.nom })}>
              <div className="flex flex-col justify-between gap-x-3 gap-y-1 lg:flex-row lg:items-baseline">
                <span className="font-display text-h3 font-medium">{chambre.nom}</span>
                <span className="text-sm whitespace-nowrap text-muted">
                  {t("details", { capacite: chambre.capacite, prix: chambre.prix })}
                </span>
              </div>
            </CarteChambre>
          ))}
        </Carrousel>
      </Apparition>
    </section>
  );
}
