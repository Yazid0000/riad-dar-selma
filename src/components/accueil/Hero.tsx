import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Apparition from "../Apparition";
import PhotoParallaxe from "./PhotoParallaxe";

export default function Hero() {
  const t = useTranslations("Accueil.hero");
  const tNav = useTranslations("Nav");

  return (
    // Hauteur = écran visible moins le header (72 px mobile, 96 px desktop).
    <section className="grid h-[calc(100svh-4.5rem)] min-h-150 grid-rows-[auto_minmax(0,1fr)] gap-7 px-gutter pt-2 pb-6 lg:h-[calc(100svh-6rem)] lg:grid-cols-[7fr_5fr] lg:grid-rows-1 lg:gap-16 lg:pt-0 lg:pb-12">
      <div className="flex flex-col justify-end gap-4.5 lg:gap-8 lg:pb-6">
        <Apparition auChargement montee={false}>
          <h1 className="font-display text-display font-medium text-balance">
            {t.rich("titre", { em: (chunks) => <em className="font-normal">{chunks}</em> })}
          </h1>
        </Apparition>
        <p className="max-w-[26em] text-lead text-pretty text-muted">{t("accroche")}</p>
        <Link href="/contact" className="bouton h-14 px-7.5 lg:self-start">
          {tNav("reserver")}
        </Link>
      </div>
      <Apparition arche auChargement className="relative overflow-hidden rounded-arch bg-placeholder">
        <PhotoParallaxe>
          <Image
            src="1750859464437-b66433efd869"
            alt={t("photo")}
            fill
            preload
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </PhotoParallaxe>
      </Apparition>
    </section>
  );
}
