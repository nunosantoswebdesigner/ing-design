import { NextResponse } from "next/server";

import {
  extractButtonFigmaTokens,
  resolveButtonCodeTokens,
} from "@/lib/button-pilot";
import {
  buildStyleKeyToCssVar,
  computeDiff,
  extractTokensFromNode,
  FigmaRateLimitError,
  fetchFigmaNodes,
  fetchFigmaStyles,
  parseFigmaUrl,
  resolveFigmaUrl,
} from "@/lib/figma-diff";
import { source } from "@/lib/source";
import { DEFAULT_REGISTRY_THEME_ID, REGISTRY_THEMES } from "@/lib/themes";

export const dynamic = "force-dynamic";

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ theme: string; component: string }> }
) => {
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
      { status: 501 }
    );
  }

  // ── Resolve the Figma URL for this component + theme ────────────────────────
  const page = source
    .getPages()
    .find((p) => p.url.split("/").pop() === component);
  const figmaUrl = resolveFigmaUrl(page?.data.figma, theme, themeConfig.figma);
  if (!figmaUrl) {
    return NextResponse.json(
      {
        error: "No Figma URL found",
        hint: `Add a figma: URL to the frontmatter of ${component}.mdx (a single URL, or a map keyed by theme id) or set figma on the theme config.`,
      },
      { status: 404 }
    );
  }

  const parsed = parseFigmaUrl(figmaUrl);
  if (!parsed) {
    return NextResponse.json(
      { error: "Could not parse Figma file/node from URL", url: figmaUrl },
      { status: 422 }
    );
  }
  const { fileKey, nodeId } = parsed;

  // ── Fetch the component's own node (the actual diff target) ─────────────────
  let nodeResponse;
  try {
    nodeResponse = await fetchFigmaNodes(fileKey, figmaToken, [nodeId]);
  } catch (error) {
    if (error instanceof FigmaRateLimitError) {
      return NextResponse.json(
        {
          error: "Figma API rate limit exceeded",
          retryAfterSeconds: error.retryAfterSeconds,
          retryAt: new Date(
            Date.now() + error.retryAfterSeconds * 1000
          ).toISOString(),
        },
        { status: 429 }
      );
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { detail: message, error: "Figma node request failed", fileKey, nodeId },
      { status: 502 }
    );
  }

  const nodeEntry = nodeResponse.nodes[nodeId];
  if (!nodeEntry) {
    return NextResponse.json(
      {
        error: "Node not found in Figma file",
        fileKey,
        hint: `node-id ${nodeId} was not returned — check the frame in ${component}.mdx's figma URL still exists.`,
        nodeId,
      },
      { status: 404 }
    );
  }

  // ── Published styles (best-effort) — only used to label fills by name ───────
  let styleKeyToCssVar = new Map<string, string>();
  try {
    const stylesResponse = await fetchFigmaStyles(fileKey, figmaToken);
    styleKeyToCssVar = buildStyleKeyToCssVar(stylesResponse);
  } catch {
    // No published styles, or the token lacks library scope — fall back to
    // hex-matching against the code tokens inside extractTokensFromNode.
  }

  // Variables API is confirmed unavailable on this Figma plan (no
  // file_variables:read scope offered at all) — that's an account-level fact,
  // not something to re-check on every diff request. Probing it here on
  // every open burned real rate-limit quota for a known-negative result and
  // contributed to 429s in production. If the plan changes, flip this back
  // to a live `fetchFigmaVariables` probe.
  const variablesAvailable = false;

  // ── Diff against this theme's light tokens ──────────────────────────────────
  const baseTheme = REGISTRY_THEMES.find(
    (t) => t.id === DEFAULT_REGISTRY_THEME_ID
  );
  const cssVarsLight = {
    ...baseTheme?.cssVars?.light,
    ...themeConfig.cssVars?.light,
  };

  const figmaTokens = extractTokensFromNode(
    nodeEntry.document,
    styleKeyToCssVar,
    cssVarsLight
  );
  let codeTokens = cssVarsLight;

  // Pilot: Button also gets padding/gap/radius/typography/stroke/shadow/opacity
  // compared, not just color + generic radius. See lib/button-pilot.ts for why
  // this isn't generalized to every component yet.
  if (component === "button") {
    for (const [cssVar, value] of extractButtonFigmaTokens(
      nodeEntry.document
    )) {
      figmaTokens.set(cssVar, value);
    }
    codeTokens = { ...codeTokens, ...resolveButtonCodeTokens(cssVarsLight) };
  }

  const result = computeDiff(
    figmaTokens,
    codeTokens,
    component,
    theme,
    fileKey,
    "node",
    variablesAvailable
  );

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
};
