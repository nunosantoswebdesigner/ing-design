import { NextResponse } from "next/server";

import {
  computeDiff,
  extractFigmaFileKey,
  extractTokensFromStyles,
  fetchFigmaNodes,
  fetchFigmaStyles,
} from "@/lib/figma-diff";
import { source } from "@/lib/source";
import { DEFAULT_REGISTRY_THEME_ID, REGISTRY_THEMES } from "@/lib/themes";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ theme: string; component: string }> },
) {
  const { theme, component } = await params;

  // ── Validate theme ──────────────────────────────────────────────────────────
  const themeConfig = REGISTRY_THEMES.find((t) => t.id === theme);
  if (!themeConfig) {
    return NextResponse.json({ error: "Theme not found" }, { status: 404 });
  }

  // ── Figma token required ────────────────────────────────────────────────────
  const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
  if (!figmaToken) {
    return NextResponse.json(
      {
        error: "FIGMA_ACCESS_TOKEN not configured",
        hint: "Add FIGMA_ACCESS_TOKEN to your .env.local file. Get a personal access token at figma.com/settings → Security → Personal access tokens.",
      },
      { status: 501 },
    );
  }

  // ── Find Figma URL from MDX frontmatter ─────────────────────────────────────
  const page = source.getPages().find((p) => p.url.split("/").pop() === component);
  const figmaUrl = page?.data.figma ?? themeConfig.figma;
  if (!figmaUrl) {
    return NextResponse.json(
      {
        error: "No Figma URL found",
        hint: `Add a figma: URL to the frontmatter of ${component}.mdx, or set figma on the theme config.`,
      },
      { status: 404 },
    );
  }

  // ── Extract file key ────────────────────────────────────────────────────────
  const fileKey = extractFigmaFileKey(figmaUrl);
  if (!fileKey) {
    return NextResponse.json(
      { error: "Could not parse Figma file key from URL", url: figmaUrl },
      { status: 422 },
    );
  }

  // ── Fetch Figma styles (free tier) ──────────────────────────────────────────
  let stylesResponse;
  try {
    stylesResponse = await fetchFigmaStyles(fileKey, figmaToken);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const isScope = message.includes("library_content:read");
    return NextResponse.json(
      {
        detail: message,
        error: "Figma API request failed",
        hint: isScope
          ? "The token is missing the 'library_content:read' scope. Regenerate it at figma.com/settings → Security → Personal access tokens and enable Library content: Read."
          : undefined,
      },
      { status: 502 },
    );
  }

  // ── Fetch node data for each style ──────────────────────────────────────────
  const nodeIds = stylesResponse.meta.styles
    .filter((s) => s.style_type === "FILL" || s.style_type === "TEXT")
    .map((s) => s.node_id);

  if (nodeIds.length === 0) {
    return NextResponse.json(
      {
        error: "No published styles found in this Figma file",
        hint: "Make sure the file has published color or text styles (not just local styles).",
      },
      { status: 404 },
    );
  }

  let nodesResponse;
  try {
    nodesResponse = await fetchFigmaNodes(fileKey, figmaToken, nodeIds);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { detail: message, error: "Figma nodes request failed" },
      { status: 502 },
    );
  }

  // ── Extract tokens from styles + nodes ──────────────────────────────────────
  const figmaTokens = extractTokensFromStyles(stylesResponse, nodesResponse);

  // ── Get CSS vars for this theme (dark mode) ─────────────────────────────────
  const baseTheme = REGISTRY_THEMES.find((t) => t.id === DEFAULT_REGISTRY_THEME_ID);
  const cssVarsDark = {
    ...baseTheme?.cssVars?.dark,
    ...themeConfig.cssVars?.dark,
  };

  // ── Compute and return diff ──────────────────────────────────────────────────
  const result = computeDiff(figmaTokens, cssVarsDark, component, theme, fileKey, "styles");

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
