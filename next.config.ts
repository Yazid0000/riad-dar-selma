import type { NextConfig } from "next";

// next-intl : on indique où se trouve la configuration des traductions.
// (Équivalent du plugin next-intl, sans sa dépendance SWC.)
const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    resolveAlias: {
      "next-intl/config": "./src/i18n/request.ts",
    },
  },
  // Toutes les photos viennent d'Unsplash : <Image src="identifiant"> passe par ce chargeur.
  images: {
    loader: "custom",
    loaderFile: "./src/unsplash-loader.ts",
  },
  // Sécurité : ne pas annoncer « X-Powered-By: Next.js » aux visiteurs (ni aux attaquants).
  poweredByHeader: false,
  // En-têtes de sécurité envoyés avec chaque page.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Interdit d'afficher le site dans un cadre sur un autre site (piège à clics invisible).
          { key: "X-Frame-Options", value: "DENY" },
          // Le navigateur ne devine pas le type d'un fichier : un fichier texte ne sera jamais exécuté.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Vers les sites externes (OpenStreetMap, Unsplash…), on n'envoie que le domaine, pas l'adresse complète.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Le site n'utilise ni caméra, ni micro, ni géolocalisation : on les bloque d'office.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
