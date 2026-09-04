"use client";

import { motion } from "motion/react";
import { useRef } from "react";

import { FigmaDiffButton } from "@/components/docs/figma-diff-button";
import { RegistryAddButton } from "@/components/docs/registry-add-button";
import { CopyButton } from "@/components/features/copy-button";
import { TextFlip } from "@/components/ui/text-flip";
import { SITE } from "@/constants/site";
import { useCurrentRegistryTheme } from "@/hooks/use-registry-theme";
import { cn } from "@/lib/utils";
import registry from "@/registry.json";

// Package manager switching is disabled for now — npm only. The original
// multi-manager map is kept so the command text stays in one place and the
// Tabs-based switcher (npm/pnpm/vite/yarn) can be restored later by wiring
// it back to usePackageManager() and rendering a TabsList/TabsContent pair
// per entry, the way this file used to.
const NPM_COMMAND = "npx";

const registryItemNames = registry.items
  .map((item) => item.name)
  .toSorted((a, b) =>
    a.localeCompare(b, "en", {
      sensitivity: "base",
    })
  );

export const CommandBox = ({
  className,
  componentName,
}: {
  className?: string;
  componentName?: string;
}) => {
  const currentItemRef = useRef(registryItemNames[0]);
  const currentTheme = useCurrentRegistryTheme();

  return (
    <div
      className={cn(
        "bg-code text-code-foreground relative rounded-lg text-sm",
        className
      )}
    >
      <div className="border-border/50 flex items-center gap-2 border-b px-3 py-1">
        <div className="flex items-center gap-2 py-1.5">
          <img alt="" className="size-4" src="/favicon.svg" />
          <span className="text-muted-foreground text-sm font-medium">
            ING Design Plugin
          </span>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 mr-6">
          <FigmaDiffButton
            componentName={componentName}
            theme={currentTheme.id}
            disabled={!componentName}
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 border-none px-2 opacity-70 hover:opacity-100 focus-visible:opacity-100 [&_svg:not([class*='size-'])]:size-3.5"
          />
          <RegistryAddButton
            registry={SITE.REGISTRY}
            disabled={!componentName}
            className="mr-1 h-7 gap-1.5 border-none px-2 opacity-70 hover:opacity-100 focus-visible:opacity-100 [&_svg:not([class*='size-'])]:size-3.5"
            variant="ghost"
            size="sm"
          />
          <CopyButton
            className="size-7 opacity-70 hover:opacity-100 focus-visible:opacity-100 top-1.5"
            value={() =>
              `${NPM_COMMAND} shadcn@latest add ${SITE.REGISTRY}/${componentName ?? currentItemRef.current}`
            }
            event="copy_npm_command"
          />
        </div>
      </div>
      <pre className="-translate-y-px overflow-hidden px-4 py-3.5">
        <code
          data-language="bash"
          className="text-left block font-mono text-sm text-muted-foreground max-sm:leading-6"
        >
          <span className="block sm:inline-block">
            <span className="select-none">$ </span>
            {NPM_COMMAND} shadcn add{" "}
            <span className="select-none sm:hidden" aria-hidden="true">
              \
            </span>
          </span>

          <span>{SITE.REGISTRY}/</span>

          {componentName ? (
            <span className="text-foreground">{componentName}</span>
          ) : (
            <TextFlip
              className="text-foreground"
              as={motion.span}
              variants={{
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 12 },
                initial: { opacity: 0, y: -12 },
              }}
              interval={1.5}
              onIndexChange={(index: number) => {
                currentItemRef.current = registryItemNames[index];
              }}
            >
              {registryItemNames}
            </TextFlip>
          )}
        </code>
      </pre>
    </div>
  );
};
