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
  fills?: FigmaFill[];
  style?: {
    fontSize?: number;
    fontFamily?: string;
    lineHeightPx?: number;
  };
  cornerRadius?: number;
}

export interface FigmaNodesResponse {
  nodes: Record<string, { document: FigmaNodeDocument } | null>;
}

// ─── Color conversion ─────────────────────────────────────────────────────────

function toSrgb(linear: number): number {
  const c = Math.max(0, Math.min(1, linear));
  return c <= 0.003_130_8 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

function oklchToHex(l: number, c: number, h: number): string {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const lp = l + 0.396_337_777_4 * a + 0.215_803_757_3 * b;
  const mp = l - 0.105_561_345_8 * a - 0.063_854_172_8 * b;
  const sp = l - 0.089_484_177_5 * a - 1.291_485_548 * b;

  const rLin = 4.076_741_662_1 * lp ** 3 - 3.307_711_591_3 * mp ** 3 + 0.230_969_929_2 * sp ** 3;
  const gLin = -1.268_438_004_6 * lp ** 3 + 2.609_757_401_1 * mp ** 3 - 0.341_319_396_5 * sp ** 3;
  const bLin = -0.004_196_086_3 * lp ** 3 - 0.703_418_614_7 * mp ** 3 + 1.707_614_701 * sp ** 3;

  const r = Math.round(toSrgb(rLin) * 255);
  const g = Math.round(toSrgb(gLin) * 255);
  const bOut = Math.round(toSrgb(bLin) * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bOut.toString(16).padStart(2, "0")}`;
}

export function cssVarToHex(value: string): string | null {
  const m = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (m) {
    return oklchToHex(Number.parseFloat(m[1]), Number.parseFloat(m[2]), Number.parseFloat(m[3]));
  }
  if (/^#[0-9a-f]{6}$/i.test(value)) {
    return value.toLowerCase();
  }
  return null;
}

function figmaRgbaToHex(r: number, g: number, b: number): string {
  const h = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function hexDrift(a: string, b: string, tolerance = 4): boolean {
  const parse = (h: string) => [
    Number.parseInt(h.slice(1, 3), 16),
    Number.parseInt(h.slice(3, 5), 16),
    Number.parseInt(h.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  return (
    Math.abs(ar - br) > tolerance || Math.abs(ag - bg) > tolerance || Math.abs(ab - bb) > tolerance
  );
}

// ─── Figma API (free tier) ────────────────────────────────────────────────────

export function extractFigmaFileKey(url: string): string | null {
  const m = url.match(/figma\.com\/(?:design|file)\/([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}

export async function fetchFigmaStyles(
  fileKey: string,
  token: string,
): Promise<FigmaStylesResponse> {
  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}/styles`, {
    cache: "no-store",
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }
  return res.json();
}

export async function fetchFigmaNodes(
  fileKey: string,
  token: string,
  nodeIds: string[],
): Promise<FigmaNodesResponse> {
  const ids = nodeIds.join(",");
  const res = await fetch(
    `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(ids)}`,
    { cache: "no-store", headers: { "X-Figma-Token": token } },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }
  return res.json();
}

// ─── Token name normalisation ─────────────────────────────────────────────────

function normalizeFigmaName(name: string): string {
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
}

function guessCategory(cssVar: string): TokenCategory {
  if (cssVar.includes("radius")) {
    return "radius";
  }
  if (cssVar.includes("font") || cssVar.includes("text") || cssVar.includes("leading")) {
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
}

// ─── Extract tokens from Figma styles + nodes ─────────────────────────────────

export function extractTokensFromStyles(
  stylesResponse: FigmaStylesResponse,
  nodesResponse: FigmaNodesResponse,
): Map<string, { value: string; hex?: string }> {
  const tokens = new Map<string, { value: string; hex?: string }>();

  for (const style of stylesResponse.meta.styles) {
    const cssVar = normalizeFigmaName(style.name);
    const nodeEntry = nodesResponse.nodes[style.node_id];
    if (!nodeEntry) {
      continue;
    }
    const doc = nodeEntry.document;

    if (style.style_type === "FILL") {
      const fill = doc.fills?.find((f) => f.type === "SOLID" && f.visible !== false);
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
}

// ─── Main diff computation ────────────────────────────────────────────────────

export function computeDiff(
  figmaTokens: Map<string, { value: string; hex?: string }>,
  cssVars: Record<string, string>,
  component: string,
  theme: string,
  figmaFile = "unknown",
  mode = "styles",
): DiffResult {
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

  return { component, figmaFile, mode, summary, theme, tokens };
}
