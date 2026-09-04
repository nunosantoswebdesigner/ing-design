import { DEFAULT_REGISTRY_THEME_ID } from "@/lib/themes";

// ─── Output types ─────────────────────────────────────────────────────────────

export type DiffStatus = "sync" | "drift" | "missing" | "extra";
export type TokenCategory = "colors" | "radius" | "typography" | "other";

export interface DiffToken {
  cssVar: string;
  category: TokenCategory;
  figma?: { value: string; hex?: string };
  code?: { value: string; hex?: string };
  status: DiffStatus;
}

export interface DiffSummary {
  sync: number;
  drift: number;
  missing: number;
  extra: number;
  total: number;
}

export interface DiffResult {
  component: string;
  theme: string;
  mode: string;
  figmaFile: string;
  /** Whether native light+dark Figma Variables are available for this diff.
   * Currently always `false` — confirmed Enterprise-gated for this account,
   * so it's a hardcoded fact rather than a live per-request probe (probing
   * it on every diff wasted rate-limit quota on a known-negative result). */
  variablesAvailable: boolean;
  tokens: DiffToken[];
  summary: DiffSummary;
}

// ─── Figma Styles API types (free tier) ───────────────────────────────────────

interface FigmaStyleMeta {
  key: string;
  name: string;
  node_id: string;
  style_type: "FILL" | "TEXT" | "EFFECT" | "GRID";
}

export interface FigmaStylesResponse {
  meta: { styles: FigmaStyleMeta[] };
}

interface FigmaFill {
  type: string;
  color?: { r: number; g: number; b: number; a: number };
  visible?: boolean;
}

interface FigmaNodeDocument {
  name?: string;
  fills?: FigmaFill[];
  /** Style-type → style key, e.g. `{ fill: "abcd1234..." }`, matching `FigmaStyleMeta.key`. */
  styles?: Record<string, string>;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    lineHeightPx?: number;
  };
  cornerRadius?: number;
  children?: FigmaNodeDocument[];
}

export interface FigmaNodesResponse {
  nodes: Record<string, { document: FigmaNodeDocument } | null>;
}

// ─── Figma Variables API (Enterprise-gated — confirmed for this account) ──────

export interface FigmaVariablesResponse {
  meta: {
    variables: Record<string, unknown>;
    variableCollections: Record<string, unknown>;
  };
}

/** Probes the Variables REST API. Confirmed Enterprise-org only: this
 * account's own token-creation screen doesn't offer the `file_variables:read`
 * scope at all. Callers should treat a thrown error as "not available" and
 * fall back to the Styles + node-based extraction instead of assuming support. */
export const fetchFigmaVariables = async (
  fileKey: string,
  token: string
): Promise<FigmaVariablesResponse> => {
  const res = await fetch(
    `https://api.figma.com/v1/files/${fileKey}/variables/local`,
    {
      cache: "no-store",
      headers: { "X-Figma-Token": token },
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }
  return res.json();
};

// ─── Color conversion ─────────────────────────────────────────────────────────

const toSrgb = (linear: number): number => {
  const c = Math.max(0, Math.min(1, linear));
  return c <= 0.003_130_8 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
};

const oklchToHex = (l: number, c: number, h: number): string => {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const lp = l + 0.396_337_777_4 * a + 0.215_803_757_3 * b;
  const mp = l - 0.105_561_345_8 * a - 0.063_854_172_8 * b;
  const sp = l - 0.089_484_177_5 * a - 1.291_485_548 * b;

  const rLin =
    4.076_741_662_1 * lp ** 3 -
    3.307_711_591_3 * mp ** 3 +
    0.230_969_929_2 * sp ** 3;
  const gLin =
    -1.268_438_004_6 * lp ** 3 +
    2.609_757_401_1 * mp ** 3 -
    0.341_319_396_5 * sp ** 3;
  const bLin =
    -0.004_196_086_3 * lp ** 3 -
    0.703_418_614_7 * mp ** 3 +
    1.707_614_701 * sp ** 3;

  const r = Math.round(toSrgb(rLin) * 255);
  const g = Math.round(toSrgb(gLin) * 255);
  const bOut = Math.round(toSrgb(bLin) * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bOut.toString(16).padStart(2, "0")}`;
};

export const cssVarToHex = (value: string): string | null => {
  const m = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (m) {
    return oklchToHex(
      Number.parseFloat(m[1]),
      Number.parseFloat(m[2]),
      Number.parseFloat(m[3])
    );
  }
  if (/^#[0-9a-f]{6}$/i.test(value)) {
    return value.toLowerCase();
  }
  return null;
};

const hexByte = (n: number) =>
  Math.round(n * 255)
    .toString(16)
    .padStart(2, "0");

const figmaRgbaToHex = (r: number, g: number, b: number): string =>
  `#${hexByte(r)}${hexByte(g)}${hexByte(b)}`;

const hexToRgbTuple = (hex: string) => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

const hexDrift = (a: string, b: string, tolerance = 4): boolean => {
  const [ar, ag, ab] = hexToRgbTuple(a);
  const [br, bg, bb] = hexToRgbTuple(b);
  return (
    Math.abs(ar - br) > tolerance ||
    Math.abs(ag - bg) > tolerance ||
    Math.abs(ab - bb) > tolerance
  );
};

// ─── Frontmatter resolution ────────────────────────────────────────────────────

export type FigmaFrontmatter = string | Record<string, string>;

/** A component's `figma:` frontmatter can be one URL (applies to every theme)
 * or a map of theme id → URL, for design systems that keep a separate Figma
 * file per brand. Theme-level `RegistryTheme.figma` is the last-resort fallback. */
export const resolveFigmaUrl = (
  figma: FigmaFrontmatter | undefined,
  themeId: string,
  themeFallback?: string
): string | undefined => {
  if (typeof figma === "string") {
    return figma;
  }
  return (
    figma?.[themeId] ?? figma?.[DEFAULT_REGISTRY_THEME_ID] ?? themeFallback
  );
};

// ─── Figma API (free tier) ────────────────────────────────────────────────────

export const extractFigmaFileKey = (url: string): string | null => {
  const m = url.match(/figma\.com\/(?:design|file)\/([A-Za-z0-9]+)/);
  return m ? m[1] : null;
};

export interface ParsedFigmaUrl {
  fileKey: string;
  nodeId: string;
}

/** Parses a Figma URL into `{ fileKey, nodeId }`, converting the URL's
 * dash-separated node id (`402-654`) into the API's colon form (`402:654`). */
export const parseFigmaUrl = (url: string): ParsedFigmaUrl | null => {
  const fileMatch = url.match(/figma\.com\/(?:design|file)\/([A-Za-z0-9]+)/);
  const nodeMatch = url.match(/node-id=([^&]+)/);
  if (!fileMatch || !nodeMatch) {
    return null;
  }
  return {
    fileKey: fileMatch[1],
    nodeId: decodeURIComponent(nodeMatch[1]).replace(/-/, ":"),
  };
};

// Figma's own rate limit is per-token, shared across every visitor hitting
// this route — a 5 min cache keeps repeated diffs (same component, same
// theme) from re-spending that quota on data that rarely changes minute to
// minute. Diffing a design that just changed may lag briefly; that's an
// acceptable trade for not 429ing under normal traffic.
const FIGMA_CACHE_SECONDS = 300;

export const fetchFigmaStyles = async (
  fileKey: string,
  token: string
): Promise<FigmaStylesResponse> => {
  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}/styles`, {
    headers: { "X-Figma-Token": token },
    next: { revalidate: FIGMA_CACHE_SECONDS },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }
  return res.json();
};

export const fetchFigmaNodes = async (
  fileKey: string,
  token: string,
  nodeIds: string[]
): Promise<FigmaNodesResponse> => {
  const ids = nodeIds.join(",");
  const res = await fetch(
    `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(ids)}`,
    {
      headers: { "X-Figma-Token": token },
      next: { revalidate: FIGMA_CACHE_SECONDS },
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }
  return res.json();
};

// ─── Token name normalisation ─────────────────────────────────────────────────

const normalizeFigmaName = (name: string): string => {
  if (name.startsWith("--")) {
    return name;
  }
  const parts = name.split("/");
  const leaf = parts.at(-1) ?? name;
  return `--${leaf
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^a-z0-9-]/g, "")}`;
};

/** Maps each published style's key (as referenced by `node.styles.fill`, etc.)
 * to its normalized CSS var name, for labeling a component node's fills. */
export const buildStyleKeyToCssVar = (
  stylesResponse: FigmaStylesResponse
): Map<string, string> => {
  const map = new Map<string, string>();
  for (const style of stylesResponse.meta.styles) {
    map.set(style.key, normalizeFigmaName(style.name));
  }
  return map;
};

const guessCategory = (cssVar: string): TokenCategory => {
  if (cssVar.includes("radius")) {
    return "radius";
  }
  if (
    cssVar.includes("font") ||
    cssVar.includes("text") ||
    cssVar.includes("leading")
  ) {
    return "typography";
  }
  if (
    cssVar.includes("background") ||
    cssVar.includes("foreground") ||
    cssVar.includes("primary") ||
    cssVar.includes("secondary") ||
    cssVar.includes("muted") ||
    cssVar.includes("accent") ||
    cssVar.includes("destructive") ||
    cssVar.includes("border") ||
    cssVar.includes("input") ||
    cssVar.includes("ring") ||
    cssVar.includes("card") ||
    cssVar.includes("popover") ||
    cssVar.includes("color")
  ) {
    return "colors";
  }
  return "other";
};

// ─── Extract tokens from Figma styles + nodes ─────────────────────────────────

export const extractTokensFromStyles = (
  stylesResponse: FigmaStylesResponse,
  nodesResponse: FigmaNodesResponse
): Map<string, { value: string; hex?: string }> => {
  const tokens = new Map<string, { value: string; hex?: string }>();

  for (const style of stylesResponse.meta.styles) {
    const cssVar = normalizeFigmaName(style.name);
    const nodeEntry = nodesResponse.nodes[style.node_id];
    if (!nodeEntry) {
      continue;
    }
    const doc = nodeEntry.document;

    if (style.style_type === "FILL") {
      const fill = doc.fills?.find(
        (f) => f.type === "SOLID" && f.visible !== false
      );
      if (fill?.color) {
        const hex = figmaRgbaToHex(fill.color.r, fill.color.g, fill.color.b);
        tokens.set(cssVar, { hex, value: hex });
      }
    } else if (style.style_type === "TEXT" && doc.style) {
      const { fontSize, fontFamily, lineHeightPx } = doc.style;
      if (cssVar.includes("size") && fontSize !== undefined) {
        tokens.set(cssVar, { value: `${fontSize}px` });
      } else if (cssVar.includes("family") && fontFamily) {
        tokens.set(cssVar, { value: fontFamily });
      } else if (cssVar.includes("leading") && lineHeightPx !== undefined) {
        tokens.set(cssVar, { value: `${lineHeightPx}px` });
      }
    }
  }

  return tokens;
};

// ─── Extract tokens from a single component node ──────────────────────────────

const walkNode = (
  doc: FigmaNodeDocument,
  visit: (node: FigmaNodeDocument) => void
): void => {
  visit(doc);
  for (const child of doc.children ?? []) {
    walkNode(child, visit);
  }
};

/**
 * Builds a token map from one component's Figma node (its frame/instance and
 * descendants), rather than every published style in the whole file. A fill
 * is named via its attached style (if any), else via a hex match against the
 * current code tokens (if any), else it's kept as an unmapped "extra" entry
 * so it's still visible instead of silently dropped.
 */
export const extractTokensFromNode = (
  root: FigmaNodeDocument,
  styleKeyToCssVar: Map<string, string>,
  codeCssVars: Record<string, string>
): Map<string, { value: string; hex?: string }> => {
  const hexToCssVar = new Map<string, string>();
  for (const [cssVar, value] of Object.entries(codeCssVars)) {
    const hex = cssVarToHex(value);
    if (hex) {
      hexToCssVar.set(hex, cssVar);
    }
  }

  const tokens = new Map<string, { value: string; hex?: string }>();
  let radius: number | undefined;

  walkNode(root, (node) => {
    const fill = node.fills?.find(
      (f) => f.type === "SOLID" && f.visible !== false
    );
    if (fill?.color) {
      const hex = figmaRgbaToHex(fill.color.r, fill.color.g, fill.color.b);
      const styleKey = node.styles?.fill;
      // Fall back to a hex-keyed bucket (not a per-occurrence counter) so the
      // same unnamed color reused across many nodes — e.g. every variant in a
      // component set — collapses into one entry instead of dozens.
      const cssVar =
        (styleKey && styleKeyToCssVar.get(styleKey)) ??
        hexToCssVar.get(hex) ??
        `--figma-fill-${hex.slice(1)}`;
      tokens.set(cssVar, { hex, value: hex });
    }
    if (
      radius === undefined &&
      typeof node.cornerRadius === "number" &&
      node.cornerRadius > 0
    ) {
      radius = node.cornerRadius;
    }
  });

  if (radius !== undefined) {
    tokens.set("--radius", { value: `${radius}px` });
  }

  return tokens;
};

// ─── Main diff computation ────────────────────────────────────────────────────

export const computeDiff = (
  figmaTokens: Map<string, { value: string; hex?: string }>,
  cssVars: Record<string, string>,
  component: string,
  theme: string,
  figmaFile = "unknown",
  mode = "node",
  variablesAvailable = false
): DiffResult => {
  // Build code token map
  const codeTokens = new Map<string, { value: string; hex?: string }>();
  for (const [cssVar, value] of Object.entries(cssVars)) {
    const hex = cssVarToHex(value) ?? undefined;
    codeTokens.set(cssVar, { hex, value });
  }

  // Compute diff
  const tokens: DiffToken[] = [];
  const allVars = new Set([...figmaTokens.keys(), ...codeTokens.keys()]);

  for (const cssVar of allVars) {
    const figma = figmaTokens.get(cssVar);
    const code = codeTokens.get(cssVar);
    const category = guessCategory(cssVar);

    let status: DiffStatus;

    if (figma && code) {
      if (figma.hex && code.hex) {
        status = hexDrift(figma.hex, code.hex) ? "drift" : "sync";
      } else {
        const fv = figma.value.replaceAll(/\s/g, "").toLowerCase();
        const cv = code.value.replaceAll(/\s/g, "").toLowerCase();
        status = fv === cv ? "sync" : "drift";
      }
    } else if (figma && !code) {
      status = "missing";
    } else {
      status = "extra";
    }

    tokens.push({ category, code, cssVar, figma, status });
  }

  // Sort: drift → missing → sync → extra, then alphabetically
  const order: DiffStatus[] = ["drift", "missing", "sync", "extra"];
  tokens.sort((a, b) => {
    const oa = order.indexOf(a.status);
    const ob = order.indexOf(b.status);
    if (oa !== ob) {
      return oa - ob;
    }
    return a.cssVar.localeCompare(b.cssVar);
  });

  const summary: DiffSummary = {
    drift: tokens.filter((t) => t.status === "drift").length,
    extra: tokens.filter((t) => t.status === "extra").length,
    missing: tokens.filter((t) => t.status === "missing").length,
    sync: tokens.filter((t) => t.status === "sync").length,
    total: tokens.length,
  };

  return {
    component,
    figmaFile,
    mode,
    summary,
    theme,
    tokens,
    variablesAvailable,
  };
};
