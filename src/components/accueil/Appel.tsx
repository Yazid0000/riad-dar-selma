import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Bandeau final, bleu Majorelle dans les deux thèmes.
export default function Appel() {
  const t = useTranslations("Accueil.appel");
  const tNav = useTranslations("Nav");

  return (
    <section className="flex flex-col items-center gap-9 bg-majorelle px-gutter py-section text-center text-white">
      <div aria-hidden="true" className="h-14 w-10 rounded-arch border-[1.5px] border-b-0 border-white" />
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
    </section>
  );
}
