export interface ThemeCssVars {
  light: Record<string, string>;
  dark: Record<string, string>;
}

export interface RegistryTheme {
  id: string;
  label: string;
  colorTheme?: string;
  figma?: string;
  cssVars?: ThemeCssVars;
}

export const REGISTRY_THEMES: RegistryTheme[] = [
  {
    cssVars: {
      dark: {
        "--accent": "oklch(0.371 0 0)",
        "--accent-foreground": "oklch(0.985 0 0)",
        "--background": "oklch(0.145 0 0)",
        "--border": "oklch(1 0 0 / 10%)",
        "--destructive": "oklch(0.704 0.191 22.216)",
        "--foreground": "oklch(0.985 0 0)",
        "--input": "oklch(1 0 0 / 15%)",
        "--muted": "oklch(0.269 0 0)",
        "--muted-foreground": "oklch(0.708 0 0)",
        "--primary": "oklch(0.922 0 0)",
        "--primary-foreground": "oklch(0.205 0 0)",
        "--ring": "oklch(0.556 0 0)",
        "--secondary": "oklch(0.269 0 0)",
        "--secondary-foreground": "oklch(0.985 0 0)",
      },
      light: {
        "--accent": "oklch(0.97 0 0)",
        "--accent-foreground": "oklch(0.205 0 0)",
        "--background": "oklch(1 0 0)",
        "--border": "oklch(0.922 0 0)",
        "--destructive": "oklch(0.577 0.245 27.325)",
        "--foreground": "oklch(0.145 0 0)",
        "--input": "oklch(0.922 0 0)",
        "--muted": "oklch(0.97 0 0)",
        "--muted-foreground": "oklch(0.556 0 0)",
        "--primary": "oklch(0.205 0 0)",
        "--primary-foreground": "oklch(0.985 0 0)",
        "--radius": "0.625rem",
        "--ring": "oklch(0.708 0 0)",
        "--secondary": "oklch(0.97 0 0)",
        "--secondary-foreground": "oklch(0.205 0 0)",
      },
    },
    id: "new-york",
    label: "New York",
  },
  {
    colorTheme: "force8",
    cssVars: {
      dark: {
        "--accent": "oklch(0.25 0.07 38)",
        "--accent-foreground": "oklch(0.9 0.08 38)",
        "--border": "oklch(0.3 0.07 38)",
        "--input": "oklch(0.3 0.07 38)",
        "--muted": "oklch(0.22 0.04 38)",
        "--muted-foreground": "oklch(0.6 0.08 38)",
        "--primary": "oklch(0.68 0.22 38)",
        "--primary-foreground": "oklch(0.1 0 0)",
        "--ring": "oklch(0.68 0.22 38)",
        "--secondary": "oklch(0.22 0.06 38)",
        "--secondary-foreground": "oklch(0.9 0.08 38)",
      },
      light: {
        "--accent": "oklch(0.91 0.07 38)",
        "--accent-foreground": "oklch(0.35 0.15 38)",
        "--border": "oklch(0.87 0.06 38)",
        "--destructive": "oklch(0.55 0.25 15)",
        "--input": "oklch(0.87 0.06 38)",
        "--muted": "oklch(0.95 0.03 38)",
        "--muted-foreground": "oklch(0.52 0.08 38)",
        "--primary": "oklch(0.62 0.22 38)",
        "--primary-foreground": "oklch(1 0 0)",
        "--radius": "0.125rem",
        "--ring": "oklch(0.62 0.22 38)",
        "--secondary": "oklch(0.94 0.05 38)",
        "--secondary-foreground": "oklch(0.35 0.15 38)",
      },
    },
    id: "force8",
    label: "Force8",
  },
  {
    colorTheme: "myswissski",
    cssVars: {
      dark: {
        "--accent": "oklch(0.24 0.08 255)",
        "--accent-foreground": "oklch(0.88 0.08 255)",
        "--border": "oklch(0.28 0.07 255)",
        "--input": "oklch(0.28 0.07 255)",
        "--muted": "oklch(0.2 0.04 255)",
        "--muted-foreground": "oklch(0.58 0.07 255)",
        "--primary": "oklch(0.58 0.2 255)",
        "--primary-foreground": "oklch(1 0 0)",
        "--ring": "oklch(0.58 0.18 255)",
        "--secondary": "oklch(0.2 0.06 255)",
        "--secondary-foreground": "oklch(0.88 0.08 255)",
      },
      light: {
        "--accent": "oklch(0.89 0.07 255)",
        "--accent-foreground": "oklch(0.3 0.15 255)",
        "--border": "oklch(0.85 0.05 255)",
        "--destructive": "oklch(0.55 0.25 15)",
        "--input": "oklch(0.85 0.05 255)",
        "--muted": "oklch(0.94 0.03 255)",
        "--muted-foreground": "oklch(0.5 0.07 255)",
        "--primary": "oklch(0.42 0.2 255)",
        "--primary-foreground": "oklch(1 0 0)",
        "--radius": "0.5rem",
        "--ring": "oklch(0.55 0.18 255)",
        "--secondary": "oklch(0.93 0.05 255)",
        "--secondary-foreground": "oklch(0.3 0.15 255)",
      },
    },
    id: "myswissski",
    label: "My Swiss Ski",
  },
  {
    colorTheme: "myicehockey",
    cssVars: {
      dark: {
        "--accent": "oklch(0.23 0.08 210)",
        "--accent-foreground": "oklch(0.86 0.07 210)",
        "--border": "oklch(0.27 0.07 210)",
        "--input": "oklch(0.27 0.07 210)",
        "--muted": "oklch(0.19 0.04 210)",
        "--muted-foreground": "oklch(0.57 0.06 210)",
        "--primary": "oklch(0.62 0.18 210)",
        "--primary-foreground": "oklch(1 0 0)",
        "--ring": "oklch(0.62 0.18 210)",
        "--secondary": "oklch(0.19 0.06 210)",
        "--secondary-foreground": "oklch(0.86 0.07 210)",
      },
      light: {
        "--accent": "oklch(0.87 0.08 210)",
        "--accent-foreground": "oklch(0.28 0.12 210)",
        "--border": "oklch(0.84 0.06 210)",
        "--destructive": "oklch(0.55 0.25 15)",
        "--input": "oklch(0.84 0.06 210)",
        "--muted": "oklch(0.93 0.03 210)",
        "--muted-foreground": "oklch(0.5 0.06 210)",
        "--primary": "oklch(0.48 0.18 210)",
        "--primary-foreground": "oklch(1 0 0)",
        "--radius": "1.5rem",
        "--ring": "oklch(0.58 0.18 210)",
        "--secondary": "oklch(0.92 0.05 210)",
        "--secondary-foreground": "oklch(0.28 0.12 210)",
      },
    },
    id: "myicehockey",
    label: "My Ice Hockey",
  },
];

export const DEFAULT_REGISTRY_THEME_ID = "new-york";
