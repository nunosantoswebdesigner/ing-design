import type { FigmaNodeDocument } from "@/lib/figma-diff";

// ─── Code side: a hand-maintained snapshot of Button's default variant ────────
//
// registry/new-york/button.tsx's buttonVariants (cva) resolves, for
// variant="default" size="default", to:
//   base:            gap-2 rounded-md text-sm font-medium
//   size "default":  h-9 px-4 py-2
//   variant "default": bg-primary text-primary-foreground (no border, no shadow-*)
//
// This is a pilot for one component — there's no Tailwind/cva parser here,
// just this list kept in sync by hand. If button.tsx's default cva output
// changes, update the numbers below to match.

// Tailwind's built-in --spacing default
const TAILWIND_SPACING_FALLBACK_REM = 0.25;

const remToPx = (value: string | undefined, fallbackRem: number): number => {
  const m = value?.match(/([\d.]+)rem/);
  const rem = m ? Number.parseFloat(m[1]) : fallbackRem;
  return rem * 16;
};

/** Resolves Button's default-variant Tailwind classes into pixel values,
 * using the given theme's light CSS vars for anything that scales with the
 * theme (--spacing, --radius) — falls back to Tailwind's own defaults for
 * themes that don't override them (only My Swiss Ski / My Ice Hockey do). */
export const resolveButtonCodeTokens = (
  cssVarsLight: Record<string, string>
): Record<string, string> => {
  const spacingPx = remToPx(
    cssVarsLight["--spacing"],
    TAILWIND_SPACING_FALLBACK_REM
  );
  const radiusPx = remToPx(cssVarsLight["--radius"], 0.625);

  return {
    // text-sm
    "--button-font-size": "14px",
    // font-medium
    "--button-font-weight": "500",
    // gap-2
    "--button-gap": `${spacingPx * 2}px`,
    // text-sm's paired line-height
    "--button-line-height": "20px",
    // default, non-disabled state
    "--button-opacity": "100%",
    // px-4
    "--button-padding-x": `${spacingPx * 4}px`,
    // py-2
    "--button-padding-y": `${spacingPx * 2}px`,
    // rounded-md -> --radius-md: calc(var(--radius) - 2px), see styles/globals.css
    "--button-radius": `${radiusPx - 2}px`,
    // no shadow-* class on the default variant
    "--button-shadow": "none",
    // no border class on the default variant
    "--button-stroke-width": "0px",
  };
};

// ─── Figma side: read the (single, scoped) Button node directly ───────────────

const findFirstText = (node: FigmaNodeDocument): FigmaNodeDocument | null => {
  if (node.type === "TEXT" && node.style) {
    return node;
  }
  for (const child of node.children ?? []) {
    const found = findFirstText(child);
    if (found) {
      return found;
    }
  }
  return null;
};

const hasVisibleSolidStroke = (node: FigmaNodeDocument): boolean =>
  (node.strokes ?? []).some((s) => s.type === "SOLID" && s.visible !== false);

/** Reads padding/gap/radius/opacity/stroke/shadow straight off the root node
 * (no tree-walk needed for these — they're properties of the button's own
 * frame), plus font size/weight/line-height off the first text layer found. */
export const extractButtonFigmaTokens = (
  root: FigmaNodeDocument
): Map<string, { value: string; hex?: string }> => {
  const tokens = new Map<string, { value: string; hex?: string }>();

  if (root.itemSpacing !== undefined) {
    tokens.set("--button-gap", { value: `${root.itemSpacing}px` });
  }
  if (root.paddingLeft !== undefined) {
    tokens.set("--button-padding-x", { value: `${root.paddingLeft}px` });
  }
  if (root.paddingTop !== undefined) {
    tokens.set("--button-padding-y", { value: `${root.paddingTop}px` });
  }
  if (root.cornerRadius !== undefined) {
    tokens.set("--button-radius", { value: `${root.cornerRadius}px` });
  }

  tokens.set("--button-opacity", {
    value: `${Math.round((root.opacity ?? 1) * 100)}%`,
  });
  tokens.set("--button-stroke-width", {
    value: hasVisibleSolidStroke(root) ? `${root.strokeWeight ?? 0}px` : "0px",
  });

  const visibleEffect = (root.effects ?? []).find((e) => e.visible !== false);
  tokens.set("--button-shadow", {
    value: visibleEffect ? visibleEffect.type : "none",
  });

  const textNode = findFirstText(root);
  if (textNode?.style) {
    const { fontSize, fontWeight, lineHeightPx } = textNode.style;
    if (fontSize !== undefined) {
      tokens.set("--button-font-size", { value: `${fontSize}px` });
    }
    if (fontWeight !== undefined) {
      tokens.set("--button-font-weight", { value: `${fontWeight}` });
    }
    if (lineHeightPx !== undefined) {
      tokens.set("--button-line-height", { value: `${lineHeightPx}px` });
    }
  }

  return tokens;
};
