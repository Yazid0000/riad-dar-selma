import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import Formulaire from "@/components/contact/Formulaire";
import { riad } from "@/data/riad";
import { rooms } from "@/data/rooms";
import Apparition from "@/components/Apparition";
import { metadonnees } from "@/i18n/site";
import Icone from "@/components/Icone";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return metadonnees({ locale, chemin: "/contact", titre: t("Contact.titre"), description: t("Meta.contact") });
}

export default function Contact({ params, searchParams }: PageProps<"/[locale]/contact">) {
  setRequestLocale(use(params).locale);
  const t = useTranslations("Contact");

  // /contact?chambre=suite-atlas (depuis une page chambre) présélectionne la chambre, si elle existe.
  const demandee = use(searchParams).chambre;
  const chambreInitiale = rooms.some((r) => r.slug === demandee) ? String(demandee) : "";

  const liens = [
    {
      titre: t("whatsapp"),
      detail: t("whatsappDetail", { tel: riad.telephone }),
      href: `https://wa.me/${riad.telephone.replace(/\D/g, "")}`,
    },
    { titre: t("email"), detail: riad.email, href: `mailto:${riad.email}` },
  ];

  return (
    <main
      id="contenu"
      className="grid items-start gap-gap-large px-gutter pt-4 pb-section lg:grid-cols-[5fr_7fr] lg:pt-8"
    >
      <Apparition auChargement className="flex flex-col gap-7">
        <h1 className="font-display text-h1-contact font-medium text-balance">{t("titre")}</h1>
        <p className="max-w-[24em] text-lead text-muted">{t("intro")}</p>
        <div className="flex flex-col">
          {liens.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 border-t border-line py-4.5 transition-colors duration-200 hover:bg-bg-2 active:bg-bg-2"
            >
              <span className="flex flex-col">
                <strong className="font-semibold">{l.titre}</strong>
                <span className="text-[15px] text-muted">{l.detail}</span>
              </span>
              {l.href.startsWith("http") && <span className="sr-only">{t("nouvelOnglet")}</span>}
              <Icone nom="north_east" className="size-5 shrink-0 text-accent" />
            </a>
          ))}
          <div className="flex flex-col border-y border-line py-4.5">
            <strong className="font-semibold">{t("delai")}</strong>
            <span className="text-[15px] text-muted">{t("delaiDetail")}</span>
          </div>
        </div>
        <Apparition arche className="relative hidden h-95 w-75 overflow-hidden rounded-arch bg-placeholder lg:block">
          <Image src="1518439532222-5dcc881e74b8" alt={t("photo")} fill sizes="300px" className="object-cover" />
        </Apparition>
      </Apparition>

      <Apparition auChargement delai={0.08}>
        <Formulaire chambreInitiale={chambreInitiale} />
      </Apparition>
    </main>
  );
}
