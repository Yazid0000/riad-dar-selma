import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  // "/" est toujours en français, "/en" toujours en anglais.
  localeDetection: false,
});
