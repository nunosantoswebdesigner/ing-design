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

// Extract actual @radix-ui/* package names from source after import rewriting.
const extractRadixPackages = (source: string): string[] => {
  const re = /from\s+["'](@radix-ui\/[^"']+)["']/g;
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    seen.add(m[1]);
  }
  return [...seen];
};

// Include both key formats: "--primary" (modern oklch) and "primary" (v0 legacy).
const expandCssVars = (vars: Record<string, string>): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(vars)) {
    out[k] = v;
    if (k.startsWith("--")) {
      out[k.slice(2)] = v;
    }
  }
  return out;
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
    "e-data-table": `import { DataTable } from "@/components/ui/e-data-table";
import type { DataTableRow } from "@/components/ui/e-data-table";

const rows: DataTableRow[] = [
  { id: "1", header: "Homepage redesign", sectionType: "Design", status: "done",       target: 10, limit: 10, reviewer: "Ana Silva"   },
  { id: "2", header: "API integration",   sectionType: "Dev",    status: "in-process", target: 8,  limit: 10, reviewer: "João Costa"   },
  { id: "3", header: "Write unit tests",  sectionType: "Dev",    status: "pending",    target: 0,  limit: 5,  reviewer: null           },
  { id: "4", header: "QA review",         sectionType: "QA",     status: "cancelled",  target: 3,  limit: 6,  reviewer: "Marta Lopes"  },
  { id: "5", header: "Deploy to staging", sectionType: "Dev",    status: "in-process", target: 5,  limit: 8,  reviewer: "João Costa"   },
];

export default function Page() {
  return (
    <div className="min-h-svh bg-background p-8">
      <DataTable
        rows={rows}
        title="Sprint Tasks"
        description="Current sprint — 5 tasks"
      />
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

  const rawCssVars =
    themeConfig.cssVars ?? REGISTRY_THEMES.find((t) => t.id === DEFAULT_REGISTRY_THEME_ID)?.cssVars;

  const cssVars = rawCssVars
    ? { dark: expandCssVars(rawCssVars.dark), light: expandCssVars(rawCssVars.light) }
    : undefined;

  // Resolve custom registry deps (other local components)
  const depFiles = await resolveCustomDeps(component, new Set([component]));

  // Collect npm deps from main component + all resolved sub-components.
  // Exclude the generic "radix-ui" entry — we resolve the specific @radix-ui/*
  // packages directly from the rewritten source imports instead.
  const allNpmDeps = new Set<string>();
  for (const name of [component, ...depFiles.map((f) => f.name)]) {
    const entry = getRegistryItem(name);
    const deps = (entry as { dependencies?: string[] } | undefined)?.dependencies ?? [];
    for (const d of deps) {
      if (d !== "radix-ui") {
        allNpmDeps.add(d);
      }
    }
  }

  // Extract actual @radix-ui/* packages from rewritten file contents
  for (const src of [content, ...depFiles.map((f) => f.content)]) {
    for (const pkg of extractRadixPackages(src)) {
      allNpmDeps.add(pkg);
    }
  }

  const dependencies = [...allNpmDeps];

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
