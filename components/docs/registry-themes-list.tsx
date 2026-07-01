import fs from "node:fs";
import path from "node:path";

import registry from "@/registry.json";
import { cn } from "@/lib/utils";

type RegistryItem = (typeof registry.items)[number];

const formatThemeName = (folder: string) =>
  folder.replaceAll(/[-_]/g, " ").replaceAll(/\b\w/g, (c) => c.toUpperCase());

const getThemes = () => {
  const registryDir = path.join(process.cwd(), "registry");

  return fs
    .readdirSync(registryDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const components = fs
        .readdirSync(path.join(registryDir, d.name))
        .filter((f) => f.endsWith(".tsx"))
        .map((f) => {
          const name = f.replace(".tsx", "");
          const meta: RegistryItem | undefined = registry.items.find((item) => item.name === name);
          return { description: meta?.description ?? null, name };
        });

      return { components, folder: d.name, label: formatThemeName(d.name) };
    });
};

export const RegistryThemesList = () => {
  const themes = getThemes();

  return (
    <div className="mt-6 flex flex-col gap-8">
      {themes.map(({ folder, label, components }) => (
        <div key={folder} className="flex flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <h3 className="font-medium text-base">{label}</h3>
            <code className="text-muted-foreground text-xs bg-muted rounded px-1.5 py-0.5">
              registry/{folder}
            </code>
            <span className="text-muted-foreground text-xs ml-auto">
              {components.length} {components.length === 1 ? "component" : "components"}
            </span>
          </div>
          <div
            className={cn(
              "rounded-xl border divide-y overflow-hidden",
              components.length === 0 && "opacity-50",
            )}
          >
            {components.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">No components yet.</p>
            ) : (
              components.map((c) => (
                <div key={c.name} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <code className="font-mono text-[0.8rem]">{c.name}</code>
                  {c.description && (
                    <span className="text-muted-foreground text-xs text-right max-w-xs">
                      {c.description}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
