import { useLocale, useTranslations } from "next-intl";
import { riad } from "@/data/riad";
import { rooms } from "@/data/rooms";
import { cheminLangue, siteUrl } from "@/i18n/site";
import unsplashLoader from "@/unsplash-loader";

// Données structurées (JSON-LD, vocabulaire schema.org) : décrivent le riad à Google
// pour qu'il puisse l'afficher comme un hébergement (adresse, prix, carte…).
// Invisible pour les visiteurs. Tester sur https://search.google.com/test/rich-results
export default function DonneesStructurees() {
  const t = useTranslations("Meta");
  const locale = useLocale();
  const prix = rooms.map((r) => r.prix);

  const donnees = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: riad.nom,
    description: t("donneesStructurees"),
    url: new URL(cheminLangue(locale), siteUrl).toString(),
    image: unsplashLoader({ src: riad.photo, width: 1200 }),
    telephone: riad.telephone.replaceAll(" ", ""),
    email: riad.email,
    priceRange: `${Math.min(...prix)} € – ${Math.max(...prix)} €`,
    currenciesAccepted: "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: riad.adresse.rue,
      addressLocality: riad.adresse.ville,
      addressRegion: riad.adresse.quartier,
      addressCountry: riad.adresse.pays,
    },
    geo: { "@type": "GeoCoordinates", latitude: riad.latitude, longitude: riad.longitude },
    containsPlace: rooms.map((r) => ({
      "@type": "HotelRoom",
      name: r.nom,
      url: new URL(cheminLangue(locale, `/chambres/${r.slug}`), siteUrl).toString(),
      occupancy: { "@type": "QuantitativeValue", maxValue: r.capacite },
      floorSize: { "@type": "QuantitativeValue", value: r.surface, unitCode: "MTK" },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // « < » remplacé par son code : un texte contenant « </script> » ne pourrait pas fermer la balise.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees).replace(/</g, "\\u003c") }}
    />
  );
}
