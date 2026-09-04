import { NextResponse } from "next/server";

import { SITE } from "@/constants/site";
import { parseFigmaUrl, resolveFigmaUrl } from "@/lib/figma-diff";
import { source } from "@/lib/source";
import { DEFAULT_REGISTRY_THEME_ID } from "@/lib/themes";

export const dynamic = "force-dynamic";

export interface DiscordSharePayload {
  title: string;
  description?: string;
  url: string;
}

// ─── Figma helpers ────────────────────────────────────────────────────────────

const fetchFigmaNodeImage = async (
  fileKey: string,
  nodeId: string,
  token: string
): Promise<string | null> => {
  const res = await fetch(
    `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(nodeId)}&format=png&scale=2`,
    { cache: "no-store", headers: { "X-Figma-Token": token } }
  );
  if (!res.ok) {
    return null;
  }
  const json = (await res.json()) as {
    err: string | null;
    images: Record<string, string>;
  };
  if (json.err) {
    return null;
  }
  return json.images[nodeId] ?? null;
};

// ─── Specs extraction ─────────────────────────────────────────────────────────

const extractSpecsFromText = (text: string): string | null => {
  const specsMatch = text.match(/##\s+Specs[\s\S]*?```(?:md)?\n([\s\S]*?)```/);
  if (!specsMatch) {
    return null;
  }
  return specsMatch[1].trim();
};

const extractSection = (specs: string, name: string): string | null => {
  const regex = new RegExp(`##\\s+${name}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`);
  const match = specs.match(regex);
  if (!match) {
    return null;
  }
  return match[1].trim();
};

const truncate = (str: string, max = 1020): string => {
  if (str.length <= max) {
    return str;
  }
  return `${str.slice(0, max - 1)}…`;
};

// ─── Specs fields builder ─────────────────────────────────────────────────────

interface EmbedField {
  inline: boolean;
  name: string;
  value: string;
}

const buildSpecsFields = async (
  page: ReturnType<typeof source.getPages>[number]
): Promise<EmbedField[]> => {
  try {
    const pageText = await page.data.getText("processed");
    const specs = extractSpecsFromText(pageText);
    if (!specs) {
      return [];
    }
    return (
      [
        ["Variants", extractSection(specs, "Variants")],
        ["States", extractSection(specs, "States")],
        ["Design tokens", extractSection(specs, "Design tokens")],
        ["Conventions", extractSection(specs, "Conventions")],
      ] as [string, string | null][]
    )
      .filter(([, v]) => v !== null)
      .map(([name, v]) => ({
        inline: false,
        name,
        value: truncate(`\`\`\`\n${v}\n\`\`\``),
      }));
  } catch {
    return [];
  }
};

// ─── POST handler ─────────────────────────────────────────────────────────────

export const POST = async (req: Request) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "DISCORD_WEBHOOK_URL not configured" },
      { status: 501 }
    );
  }

  const body = (await req.json()) as DiscordSharePayload;
  const { title, description, url } = body;

  if (!title || !url) {
    return NextResponse.json(
      { error: "title and url are required" },
      { status: 400 }
    );
  }

  const absolutePageUrl = url.startsWith("http")
    ? url
    : `${SITE.URL}${url.startsWith("/") ? url : `/${url}`}`;

  // ── Look up MDX page ────────────────────────────────────────────────────────
  const pagePath = absolutePageUrl.replace(SITE.URL, "");
  const page = source
    .getPages()
    .find((p) => p.url === pagePath || absolutePageUrl.endsWith(p.url));

  // ── Figma preview image ─────────────────────────────────────────────────────
  let previewImageUrl: string | null = null;
  const figmaToken = process.env.FIGMA_ACCESS_TOKEN;

  const figmaUrl = resolveFigmaUrl(page?.data.figma, DEFAULT_REGISTRY_THEME_ID);
  if (figmaToken && figmaUrl) {
    const parsed = parseFigmaUrl(figmaUrl);
    if (parsed) {
      previewImageUrl = await fetchFigmaNodeImage(
        parsed.fileKey,
        parsed.nodeId,
        figmaToken
      );
    }
  }

  const ogPath = absolutePageUrl
    .replace(SITE.URL, "")
    .replace(/^\/docs\//, "/og/docs/");
  const imageUrl = previewImageUrl ?? `${SITE.URL}${ogPath}`;

  // ── Extract specs from page content ────────────────────────────────────────
  const specsFields = page ? await buildSpecsFields(page) : [];

  // ── Install command ─────────────────────────────────────────────────────────
  const slug = absolutePageUrl.split("/").pop() ?? "";
  const installField = {
    inline: false,
    name: "Install",
    value: `\`\`\`\nnpx shadcn@latest add ${SITE.REGISTRY}/${slug}\n\`\`\``,
  };

  // ── Discord embed ───────────────────────────────────────────────────────────
  const embed = {
    color: 0x18_18_1B,
    description: description ?? "",
    fields: [...specsFields, installField],
    footer: {
      icon_url: `${SITE.URL}/favicon.ico`,
      text: SITE.NAME,
    },
    image: { url: imageUrl },
    title,
    url: absolutePageUrl,
  };

  const discordRes = await fetch(webhookUrl, {
    body: JSON.stringify({ embeds: [embed] }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!discordRes.ok) {
    const detail = await discordRes.text();
    return NextResponse.json(
      { detail, error: "Discord webhook failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
};
