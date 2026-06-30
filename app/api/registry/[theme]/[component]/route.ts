import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { DEFAULT_REGISTRY_THEME_ID, REGISTRY_THEMES } from "@/lib/themes";
import registry from "@/registry.json";

export const dynamic = "force-dynamic";

type RegistryItem = (typeof registry.items)[number];

const getRegistryItem = (name: string): RegistryItem | undefined =>
  registry.items.find((item) => item.name === name);

const readRegistryFile = async (name: string): Promise<string | null> => {
  try {
    return await readFile(path.join(process.cwd(), "registry/new-york", `${name}.tsx`), "utf-8");
  } catch {
    return null;
  }
};

// Recursively resolve custom registry dependencies (skips shadcn base components
// that don't exist in registry/new-york — V0 knows how to resolve those itself).
const resolveCustomDeps = async (
  name: string,
  visited: Set<string>,
): Promise<{ name: string; content: string }[]> => {
  const item = getRegistryItem(name);
  if (!item) {return [];}

  const deps = (item as { registryDependencies?: string[] }).registryDependencies ?? [];
  const results: { name: string; content: string }[] = [];

  for (const dep of deps) {
    if (visited.has(dep)) {continue;}

    const content = await readRegistryFile(dep);
    if (!content) {continue;} // shadcn base component — skip

    visited.add(dep);
    results.push({ content, name: dep });

    const nested = await resolveCustomDeps(dep, visited);
    results.push(...nested);
  }

  return results;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ theme: string; component: string }> },
) {
  const { theme, component } = await params;

  const themeConfig = REGISTRY_THEMES.find((t) => t.id === theme);
  if (!themeConfig) {
    return NextResponse.json({ error: "Theme not found" }, { status: 404 });
  }

  const content = await readRegistryFile(component);
  if (!content) {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }

  const title =
    component.charAt(0).toUpperCase() +
    component.slice(1).replaceAll(/-([a-z])/g, (_, c: string) => ` ${c.toUpperCase()}`);

  const cssVars =
    themeConfig.cssVars ?? REGISTRY_THEMES.find((t) => t.id === DEFAULT_REGISTRY_THEME_ID)?.cssVars;

  // Resolve custom deps — start visited with the component itself to prevent cycles
  const depFiles = await resolveCustomDeps(component, new Set([component]));

  const files = [
    {
      content,
      path: `components/ui/${component}.tsx`,
      target: `components/ui/${component}.tsx`,
      type: "registry:ui",
    },
    ...depFiles.map(({ name, content: depContent }) => ({
      content: depContent,
      path: `components/ui/${name}.tsx`,
      target: `components/ui/${name}.tsx`,
      type: "registry:ui",
    })),
  ];

  const registryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    description: `${title} component — ${themeConfig.label} theme`,
    files,
    name: component,
    title,
    type: "registry:ui",
    ...(cssVars ? { cssVars } : {}),
  };

  return NextResponse.json(registryItem, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
