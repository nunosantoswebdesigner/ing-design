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

// Rewrite unified `radix-ui` imports to specific @radix-ui/* packages for v0 compatibility.
// v0 expects the older per-package imports (e.g. @radix-ui/react-slot).
const rewriteRadixImports = (source: string): string =>
  source.replaceAll(/import\s*\{([^}]+)\}\s*from\s*["']radix-ui["']/g, (_, named: string) => {
    const names = named
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return names
      .map((n) => {
        // Slot → @radix-ui/react-slot; strip namespace suffix before mapping
        const pkg = n.replace(/\..+$/, "");
        return `import { ${n} } from "@radix-ui/react-${pkg.toLowerCase()}"`;
      })
      .join("\n");
  });

// Recursively resolve custom registry dependencies (skips shadcn base components
// that don't live in registry/new-york — v0 resolves those itself).
const resolveCustomDeps = async (
  name: string,
  visited: Set<string>,
): Promise<{ name: string; content: string }[]> => {
  const item = getRegistryItem(name);
  if (!item) {
    return [];
  }

  const deps = (item as { registryDependencies?: string[] }).registryDependencies ?? [];
  const results: { name: string; content: string }[] = [];

  for (const dep of deps) {
    if (visited.has(dep)) {
      continue;
    }
    const content = await readRegistryFile(dep);
    // shadcn base component — skip
    if (!content) {
      continue;
    }
    visited.add(dep);
    results.push({ content: rewriteRadixImports(content), name: dep });
    results.push(...(await resolveCustomDeps(dep, visited)));
  }

  return results;
};

// Simple demo page so v0 has something to render immediately.
const buildDemoPage = (component: string, title: string): string => {
  const importName = title
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  // Generic demo: renders the component name as a heading with a note.
  // For known components we provide a richer demo.
  const demos: Record<string, string> = {
    button: `import { ${importName} } from "@/components/ui/${component}";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">${title}</h1>
        <p className="text-sm text-muted-foreground">Component preview</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <${importName}>Default</${importName}>
        <${importName} variant="secondary">Secondary</${importName}>
        <${importName} variant="outline">Outline</${importName}>
        <${importName} variant="ghost">Ghost</${importName}>
        <${importName} variant="destructive">Destructive</${importName}>
      </div>
      <div className="flex items-center gap-3">
        <${importName} size="sm">Small</${importName}>
        <${importName}>Default</${importName}>
        <${importName} size="lg">Large</${importName}>
      </div>
    </div>
  );
}`,
  };

  return (
    demos[component] ??
    `import { ${importName} } from "@/components/ui/${component}";

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-8">
      <${importName} />
    </div>
  );
}`
  );
};

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ theme: string; component: string }> },
) => {
  const { theme, component } = await params;

  const themeConfig = REGISTRY_THEMES.find((t) => t.id === theme);
  if (!themeConfig) {
    return NextResponse.json({ error: "Theme not found" }, { status: 404 });
  }

  const raw = await readRegistryFile(component);
  if (!raw) {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }

  const content = rewriteRadixImports(raw);

  const title =
    component.charAt(0).toUpperCase() +
    component.slice(1).replaceAll(/-([a-z])/g, (_, c: string) => ` ${c.toUpperCase()}`);

  const cssVars =
    themeConfig.cssVars ?? REGISTRY_THEMES.find((t) => t.id === DEFAULT_REGISTRY_THEME_ID)?.cssVars;

  // Resolve custom registry deps (other local components)
  const depFiles = await resolveCustomDeps(component, new Set([component]));

  // Collect npm deps from main component + all resolved sub-components
  const allNpmDeps = new Set<string>();
  for (const name of [component, ...depFiles.map((f) => f.name)]) {
    const entry = getRegistryItem(name);
    const deps = (entry as { dependencies?: string[] } | undefined)?.dependencies ?? [];
    for (const d of deps) {allNpmDeps.add(d);}
  }

  // Rewrite "radix-ui" (unified) → specific @radix-ui/* packages for v0
  const dependencies = [...allNpmDeps].flatMap((d) =>
    d === "radix-ui" ? ["@radix-ui/react-slot"] : [d],
  );

  const files = [
    // Component itself
    {
      content,
      path: `components/ui/${component}.tsx`,
      target: `components/ui/${component}.tsx`,
      type: "registry:ui",
    },
    // Resolved custom sub-components
    ...depFiles.map(({ name, content: depContent }) => ({
      content: depContent,
      path: `components/ui/${name}.tsx`,
      target: `components/ui/${name}.tsx`,
      type: "registry:ui",
    })),
    // Demo page so v0 renders a preview immediately
    {
      content: buildDemoPage(component, title),
      path: "app/page.tsx",
      target: "app/page.tsx",
      type: "registry:page",
    },
  ];

  const registryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    dependencies,
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
};
