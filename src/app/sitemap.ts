import type { MetadataRoute } from "next";
import { rooms } from "@/data/rooms";
import { cheminLangue, siteUrl } from "@/i18n/site";

// Généré automatiquement à l'adresse /sitemap.xml : chaque page, avec ses versions FR et EN.
export default function sitemap(): MetadataRoute.Sitemap {
  const chemins = ["/", ...rooms.map((r) => `/chambres/${r.slug}`), "/contact"];
  const url = (locale: string, chemin: string) => new URL(cheminLangue(locale, chemin), siteUrl).toString();

  return chemins.flatMap((chemin) =>
    ["fr", "en"].map((locale) => ({
      url: url(locale, chemin),
      priority: chemin === "/" ? 1 : 0.8,
      alternates: { languages: { fr: url("fr", chemin), en: url("en", chemin) } },
    })),
  );
}
