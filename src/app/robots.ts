import type { MetadataRoute } from "next";
import { indexationBloquee, siteUrl } from "@/i18n/site";

// Généré automatiquement à l'adresse /robots.txt
// BLOQUER_INDEXATION=1 → les moteurs de recherche sont priés de ne rien explorer (projet démo).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", ...(indexationBloquee ? { disallow: "/" } : { allow: "/" }) },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
