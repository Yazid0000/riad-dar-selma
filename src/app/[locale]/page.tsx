import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import Acces from "@/components/accueil/Acces";
import Appel from "@/components/accueil/Appel";
import BarreReservation from "@/components/accueil/BarreReservation";
import Avis from "@/components/accueil/Avis";
import Chambres from "@/components/accueil/Chambres";
import Esprit from "@/components/accueil/Esprit";
import Experiences from "@/components/accueil/Experiences";
import Galerie from "@/components/accueil/Galerie";
import Hero from "@/components/accueil/Hero";

export default function Accueil({ params }: PageProps<"/[locale]">) {
  setRequestLocale(use(params).locale);

  return (
    <main>
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
