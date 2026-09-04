"use client";

import { useSearchParams } from "next/navigation";

import { DEFAULT_REGISTRY_THEME_ID, REGISTRY_THEMES } from "@/lib/themes";
import type { RegistryTheme } from "@/lib/themes";

/** Reads the `?theme=` query param used by the docs theme switcher, falling
 * back to the default registry theme when absent or unknown. Shared so every
 * consumer (Figma links, the diff button, v0 export, etc.) agrees on which
 * brand theme is "currently selected". */
export const useCurrentRegistryTheme = (): RegistryTheme => {
  const searchParams = useSearchParams();
  const themeParam = searchParams.get("theme");
  const themeId = REGISTRY_THEMES.some((t) => t.id === themeParam)
    ? (themeParam ?? DEFAULT_REGISTRY_THEME_ID)
    : DEFAULT_REGISTRY_THEME_ID;
  return REGISTRY_THEMES.find((t) => t.id === themeId) ?? REGISTRY_THEMES[0];
};
