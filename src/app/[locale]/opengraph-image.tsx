import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { riad } from "@/data/riad";
import { routing } from "@/i18n/routing";
import unsplashLoader from "@/unsplash-loader";

// Image affichée quand un lien du site est partagé (WhatsApp, LinkedIn, X…).
// Générée au build, une par langue ; les pages chambres et contact en héritent.
// ImageResponse comprend un sous-ensemble de CSS : uniquement des styles en ligne et du flexbox.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Riad Dar Selma";

// Une image par langue, fabriquée une fois au build plutôt qu'à chaque partage.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#F3F2EE", color: "#15171C" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 600 }}>
          <div style={{ width: 22, height: 30, background: "#2440A8", borderRadius: "999px 999px 0 0" }} />
          Dar Selma
        </div>
        <div style={{ fontSize: 76, lineHeight: 1, letterSpacing: -3, fontWeight: 600 }}>
          {/* t.markup rend le texte en retirant la balise <em> du titre. */}
          {t.markup("Accueil.hero.titre", { em: (chunks) => chunks })}
        </div>
        <div style={{ fontSize: 28, color: "#5B5F6A", maxWidth: 560 }}>{t("Accueil.hero.accroche")}</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", padding: "60px 80px 0 0" }}>
        <div style={{ display: "flex", width: 400, height: 570, overflow: "hidden", borderRadius: "200px 200px 0 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse ne connaît que <img> */}
          <img
            src={unsplashLoader({ src: riad.photo, width: 800 })}
            alt=""
            width={400}
            height={570}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>,
    size,
  );
}
