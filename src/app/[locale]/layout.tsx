import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { indexationBloquee, siteUrl } from "@/i18n/site";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import "../globals.css";

// Polices téléchargées au build et servies par le site lui-même (pas d'appel à Google côté visiteur).
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-bricolage",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  // Ce qui vaut pour tout le site. Le reste (description, canonique, hreflang, Open Graph)
  // est défini page par page avec metadonnees() de src/i18n/site.ts.
  return {
    metadataBase: new URL(siteUrl),
    // Titre de l'accueil, et modèle des autres pages : « Suite Atlas | Riad Dar Selma ».
    title: { default: t("titre"), template: "%s | Riad Dar Selma" },
    ...(indexationBloquee && { robots: { index: false, follow: false } }),
  };
}

// S'exécute avant l'affichage : thème choisi (localStorage), sinon réglage de l'appareil.
const scriptTheme = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${bricolage.variable} ${geist.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTheme }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
