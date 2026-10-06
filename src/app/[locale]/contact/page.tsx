import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import Formulaire from "@/components/contact/Formulaire";
import { riad } from "@/data/riad";
import { rooms } from "@/data/rooms";

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
    <main className="grid items-start gap-gap-large px-gutter pt-4 pb-section lg:grid-cols-[5fr_7fr] lg:pt-8">
      <div className="flex flex-col gap-7">
        <h1 className="font-display text-h1-contact font-medium text-balance">{t("titre")}</h1>
        <p className="max-w-[24em] text-lead text-muted">{t("intro")}</p>
        <div className="flex flex-col">
          {liens.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 border-t border-line py-4.5 hover:bg-bg-2"
            >
              <span className="flex flex-col">
                <strong className="font-semibold">{l.titre}</strong>
                <span className="text-[15px] text-muted">{l.detail}</span>
              </span>
              <span aria-hidden="true" className="text-xl text-accent">
                ↗
              </span>
            </a>
          ))}
          <div className="flex flex-col border-y border-line py-4.5">
            <strong className="font-semibold">{t("delai")}</strong>
            <span className="text-[15px] text-muted">{t("delaiDetail")}</span>
          </div>
        </div>
        <div className="relative hidden h-95 w-75 overflow-hidden rounded-arch bg-placeholder lg:block">
          <Image src="1518439532222-5dcc881e74b8" alt={t("photo")} fill sizes="300px" className="object-cover" />
        </div>
      </div>

      <Formulaire chambreInitiale={chambreInitiale} />
    </main>
  );
}
