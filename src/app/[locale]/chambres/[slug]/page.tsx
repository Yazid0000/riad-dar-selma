import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import CarteChambre from "@/components/CarteChambre";
import Icone from "@/components/Icone";
import { rooms } from "@/data/rooms";
import { Link } from "@/i18n/navigation";
import { metadonnees } from "@/i18n/site";
import Apparition from "@/components/Apparition";
import BandePhotos from "@/components/BandePhotos";

// Une page par chambre, générée au build : 6 chambres × 2 langues (la langue vient du layout parent).
export function generateStaticParams() {
  return rooms.map((chambre) => ({ slug: chambre.slug }));
}

// Toute autre adresse (/chambres/inconnue) renvoie une 404 au lieu d'essayer de la générer.
export const dynamicParams = false;

// Titre « Suite Atlas | Riad Dar Selma » (modèle du layout), description = accroche + prix.
export async function generateMetadata({ params }: PageProps<"/[locale]/chambres/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const chambre = rooms.find((r) => r.slug === slug);
  if (!chambre) return {};
  const t = await getTranslations({ locale, namespace: "Chambre" });
  const tMeta = await getTranslations({ locale, namespace: "Meta" });
  return metadonnees({
    locale,
    chemin: `/chambres/${slug}`,
    titre: chambre.nom,
    description: tMeta("chambre", { accroche: t(`accroches.${slug}`), prix: chambre.prix }),
  });
}

export default function PageChambre({ params }: PageProps<"/[locale]/chambres/[slug]">) {
  const { locale, slug } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Chambre");
  const tNav = useTranslations("Nav");

  const chambre = rooms.find((r) => r.slug === slug);
  if (!chambre) notFound();
  const autres = rooms.filter((r) => r.slug !== slug);

  const caracteristiques = [
    { label: t("capacite"), valeur: t("personnes", { n: chambre.capacite }) },
    { label: t("surface"), valeur: `${chambre.surface}\u00a0m²` },
    { label: t("lit"), valeur: chambre.lit },
  ];

  return (
    <main id="contenu">
      {/*
        Grille à zones nommées : en mobile, titre → photo → détails empilés ;
        en desktop, photo à gauche, titre et détails à droite, alignés en bas.
      */}
      <section className="grid gap-gap-large px-gutter pt-4 [grid-template-areas:'titre'_'photo'_'details'] lg:grid-cols-2 lg:grid-rows-[1fr_auto] lg:gap-x-gap-large lg:gap-y-7 lg:pt-8 lg:[grid-template-areas:'photo_titre'_'photo_details']">
        <Apparition auChargement className="flex flex-col gap-2 [grid-area:titre] lg:gap-7 lg:self-end">
          <Link href="/#chambres" className="-my-3 py-3 text-sm text-muted">
            <span className="lg:hidden">{t("retourCourt")}</span>
            <span className="hidden lg:inline">{t("retour")}</span>
          </Link>
          <h1 className="font-display text-h1-room font-medium">{chambre.nom}</h1>
        </Apparition>

        <Apparition
          arche
          auChargement
          className="relative h-110 overflow-hidden rounded-arch bg-placeholder [grid-area:photo] lg:h-180"
        >
          <Image
            src={chambre.photo}
            alt={t("photo", { nom: chambre.nom })}
            fill
            preload
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Apparition>

        <Apparition auChargement delai={0.08} className="flex flex-col gap-7 pb-2 [grid-area:details]">
          <p className="text-lead text-pretty">{t(`accroches.${chambre.slug}`)}</p>
          <dl className="grid grid-cols-3 border-y border-line">
            {caracteristiques.map((c, i) => (
              <div
                key={c.label}
                className={`flex flex-col py-3.5 ${["pr-3", "border-l border-line px-3", "border-l border-line pl-3"][i]}`}
              >
                <dt className="text-[13px] text-muted">{c.label}</dt>
                <dd className="font-semibold">{c.valeur}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="flex flex-col">
              <span className="font-display text-[40px] leading-[1.1] font-medium tracking-[-0.03em]">
                {t("prix", { prix: chambre.prix })}
              </span>
              <span className="text-sm text-muted">
                {chambre.prixPour ? t("parNuitPour", { n: chambre.prixPour }) : t("parNuit")}
              </span>
            </div>
            <Link href={{ pathname: "/contact", query: { chambre: chambre.slug } }} className="bouton h-14 px-7">
              {tNav("reserver")}
            </Link>
          </div>
        </Apparition>
      </section>

      <Apparition className="pt-gap-large">
        <BandePhotos
          photos={chambre.photos.map((p) => ({ ...p, alt: t(`photos.${p.cle}`) }))}
          fermer={tNav("fermer")}
        />
      </Apparition>

      <section className="grid gap-gap-large px-gutter py-section lg:grid-cols-[4fr_8fr]">
        <Apparition className="flex flex-col gap-4">
          <h2 className="font-display text-h2-small font-medium">{t("equipementsTitre")}</h2>
          <p className="max-w-[26em] text-muted">{t("equipementsTexte")}</p>
        </Apparition>
        {/* gap-px sur fond « line » : les cases blanches laissent voir de fines lignes entre elles. */}
        <ul className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
          {chambre.equipements.map((e, i) => (
            <li key={e.cle} className="bg-bg">
              <Apparition delai={i * 0.08} className="flex h-full flex-col gap-4.5 p-5">
                <Icone nom={e.icone} className="size-7.5 text-accent" />
                <span className="text-[15px] leading-[1.35]">{t(`equipements.${e.cle}`)}</span>
              </Apparition>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-8 pb-section">
        <Apparition>
          <h2 className="px-gutter font-display text-h2-small font-medium">{t("autres")}</h2>
        </Apparition>
        <div className="flex snap-x snap-mandatory scroll-pl-gutter items-start gap-gap overflow-x-auto px-gutter scrollbar-none">
          {autres.map((r) => (
            <CarteChambre key={r.slug} chambre={r} alt={t("photo", { nom: r.nom })} echelle="reduite">
              <span className="font-display text-xl font-medium">
                {r.nom} <span className="font-sans text-sm font-normal text-muted">{t("prix", { prix: r.prix })}</span>
              </span>
            </CarteChambre>
          ))}
        </div>
      </section>
    </main>
  );
}
