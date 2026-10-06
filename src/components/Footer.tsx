import { useTranslations } from "next-intl";
import { riad } from "@/data/riad";
import LangueToggle from "./LangueToggle";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="flex flex-col gap-16 bg-footer-bg px-gutter pt-section-small pb-10 text-footer-text">
      <div className="grid gap-10 lg:grid-cols-[6fr_3fr_3fr]">
        <span className="font-display text-brand font-medium">Dar Selma</span>
        <div className="flex flex-col gap-2 text-[15px]">
          <span className="text-footer-muted">{t("lieu")}</span>
          <a href={`tel:${riad.telephone.replaceAll(" ", "")}`}>{riad.telephone}</a>
          <a href={`mailto:${riad.email}`}>{riad.email}</a>
        </div>
        <div className="flex flex-col items-start gap-3">
          <span className="text-sm text-footer-muted">{t("langue")}</span>
          <LangueToggle pilule />
        </div>
      </div>
      <div className="flex flex-col justify-between gap-2 border-t border-footer-line pt-5 text-[13px] text-footer-muted lg:flex-row">
        <span>{t("copyright")}</span>
        <span className="font-semibold text-footer-text">{t("demo")}</span>
      </div>
    </footer>
  );
}
