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
};

export default nextConfig;
