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
};

export default nextConfig;
