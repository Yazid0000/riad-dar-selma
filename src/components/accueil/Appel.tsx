import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Apparition from "../Apparition";
import ArcheTracee from "./ArcheTracee";

// Bandeau final, bleu Majorelle dans les deux thèmes.
export default function Appel() {
  const t = useTranslations("Accueil.appel");
  const tNav = useTranslations("Nav");

  return (
    <section
      id="reserver"
      className="[&_*:focus-visible]:outline-white selection:bg-white selection:text-majorelle bg-majorelle px-gutter py-section text-center text-white"
    >
      <Apparition className="flex flex-col items-center gap-9">
        <ArcheTracee />
        <h2 className="max-w-[16ch] font-display text-h2 font-medium text-balance">
          {t.rich("titre", { em: (chunks) => <em className="font-normal">{chunks}</em> })}
        </h2>
        <p className="max-w-[30em] text-[17px]">{t("texte")}</p>
        <Link
          href="/contact"
          className="grid h-14 w-full place-items-center rounded-full bg-white px-8 font-semibold text-majorelle lg:w-auto"
        >
          {tNav("reserver")}
        </Link>
      </Apparition>
    </section>
  );
}
