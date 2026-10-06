import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import Acces from "@/components/accueil/Acces";
import Appel from "@/components/accueil/Appel";
import Avis from "@/components/accueil/Avis";
import BarreReservation from "@/components/accueil/BarreReservation";
import Chambres from "@/components/accueil/Chambres";
import DonneesStructurees from "@/components/accueil/DonneesStructurees";
import Esprit from "@/components/accueil/Esprit";
import Experiences from "@/components/accueil/Experiences";
import Galerie from "@/components/accueil/Galerie";
import Hero from "@/components/accueil/Hero";
import { metadonnees } from "@/i18n/site";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  // Pas de titre : l'accueil garde le titre par défaut du layout.
  return metadonnees({ locale, chemin: "/", description: t("description") });
}

export default function Accueil({ params }: PageProps<"/[locale]">) {
  setRequestLocale(use(params).locale);

  return (
    <main id="contenu">
      <DonneesStructurees />
      <Hero />
      <Esprit />
      <Chambres />
      <Experiences />
      <Galerie />
      <Avis />
      <Acces />
      <Appel />
      <BarreReservation />
    </main>
  );
}
