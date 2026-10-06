import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LangueToggle from "./LangueToggle";
import MenuMobile from "./MenuMobile";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const t = useTranslations("Nav");
  const liens = [
    { href: "/#chambres", label: t("chambres") },
    { href: "/#experiences", label: t("experiences") },
    { href: "/#acces", label: t("acces") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="relative z-10 flex h-18 items-center justify-between gap-6 bg-bg px-gutter lg:h-24">
      <Link href="/" aria-label={t("accueil")} className="flex shrink-0 items-center gap-2.5">
        <span aria-hidden="true" className="h-5.5 w-4 rounded-arch bg-accent" />
        <span className="font-display text-[22px] font-semibold tracking-[-0.02em]">Dar Selma</span>
      </Link>

      {/* Desktop (lg = 1024 px et plus) */}
      <nav className="hidden items-center gap-9 text-[15px] font-medium lg:flex">
        {liens.map((lien) => (
          <Link key={lien.href} href={lien.href}>
            {lien.label}
          </Link>
        ))}
      </nav>
      <div className="hidden items-center gap-6 lg:flex">
        <LangueToggle />
        <ThemeToggle />
        <Link href="/contact" className="bouton h-12 px-6 text-[15px]">
          {t("reserver")}
        </Link>
      </div>

      {/* Mobile */}
      <div className="flex items-center gap-2 lg:hidden">
        <ThemeToggle />
        <MenuMobile liens={liens} />
      </div>
    </header>
  );
}
