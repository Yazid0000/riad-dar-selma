import type { Metadata } from "next";

// Adresse publique du site.
// Sur Vercel, VERCEL_PROJECT_PRODUCTION_URL est fourni automatiquement (ex. riad-xxx.vercel.app).
// Quand tu auras ton nom de domaine, ajoute NEXT_PUBLIC_SITE_URL=https://ton-domaine dans Vercel.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// Établissement fictif : BLOQUER_INDEXATION=1 (dans Vercel ou .env.local) demande aux moteurs
// de recherche de ne rien indexer (robots.txt + balise robots sur chaque page).
export const indexationBloquee = process.env.BLOQUER_INDEXATION === "1";

// Chemin d'une page dans une langue : ("fr", "/contact") → "/contact", ("en", "/contact") → "/en/contact".
export const cheminLangue = (locale: string, chemin = "/") =>
  locale === "fr" ? chemin : `/${locale}${chemin === "/" ? "" : chemin}`;

// Métadonnées communes à chaque page : titre, description, adresse canonique, versions dans
// les autres langues (hreflang) et aperçu de partage (Open Graph).
// L'image (opengraph-image.tsx) est indiquée ici : dès qu'une page définit son propre openGraph,
// Next ne reprend plus l'image du dossier parent. Adresse sans /fr pour éviter une redirection.
export function metadonnees({
  locale,
  chemin,
  titre,
  description,
}: {
  locale: string;
  chemin: string;
  titre?: string; // absent = titre par défaut du layout
  description: string;
}): Metadata {
  // Le modèle « %s | Riad Dar Selma » du layout ne s'applique qu'à <title>, pas au partage.
  const titrePartage = titre ? `${titre} | Riad Dar Selma` : undefined;
  const image = { url: cheminLangue(locale, "/opengraph-image"), width: 1200, height: 630, alt: "Riad Dar Selma" };

  return {
    ...(titre && { title: titre }),
    description,
    alternates: {
      canonical: cheminLangue(locale, chemin),
      languages: {
        fr: cheminLangue("fr", chemin),
        en: cheminLangue("en", chemin),
        "x-default": cheminLangue("fr", chemin),
      },
    },
    openGraph: {
      type: "website",
      url: cheminLangue(locale, chemin),
      siteName: "Riad Dar Selma",
      ...(titrePartage && { title: titrePartage }),
      description,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      ...(titrePartage && { title: titrePartage }),
      description,
      images: [image.url],
    },
  };
}
