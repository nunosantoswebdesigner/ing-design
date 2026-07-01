"use client";

import { AlertTriangleIcon, GitCompareArrows, Loader2Icon } from "lucide-react";
import { useCallback, useState } from "react";

import { CodeBlockCommand } from "@/components/docs/code-block-command";
import { FigmaDiffView } from "@/components/docs/figma-diff-view";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import type { DiffResult } from "@/lib/figma-diff";
import { DEFAULT_REGISTRY_THEME_ID } from "@/lib/themes";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: DiffResult }
  | { status: "error"; message: string; hint?: string; noToken?: boolean };

// ─── Inner content ────────────────────────────────────────────────────────────

const DiffContent = ({ state, componentName }: { state: FetchState; componentName?: string }) => {
  if (state.status === "idle" || state.status === "loading") {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
      </div>
    );
  }

  if (state.status === "error") {
    if (state.noToken) {
      // No Figma token — show CLI fallback
      const suffix = componentName ? ` ${componentName}` : "";
      return (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-[12px] text-amber-600 dark:text-amber-400">
            <AlertTriangleIcon className="mt-0.5 size-3.5 shrink-0" />
            <span>
              Add <code className="font-mono font-semibold">FIGMA_ACCESS_TOKEN</code> to your{" "}
              <code className="font-mono font-semibold">.env.local</code> to enable live diff. Until
              then, use the CLI:
            </span>
          </div>
          <CodeBlockCommand
            __npm__={`npx shadcn diff${suffix}`}
            __pnpm__={`pnpm dlx shadcn diff${suffix}`}
            __yarn__={`yarn dlx shadcn diff${suffix}`}
            __vite__={`npx shadcn diff${suffix}`}
            copyEvent="copy_registry_command"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-3 px-4 py-6 text-center">
        <AlertTriangleIcon className="size-5 text-destructive" />
        <p className="text-sm text-muted-foreground">{state.message}</p>
        {state.hint && (
          <p className="max-w-xs text-[12px] text-muted-foreground/70">{state.hint}</p>
        )}
      </div>
    );
  }

  return <FigmaDiffView data={state.data} />;
};

// ─── FigmaDiffButton ──────────────────────────────────────────────────────────

export const FigmaDiffButton = ({
  componentName,
  theme = DEFAULT_REGISTRY_THEME_ID,
  className,
  size = "sm",
  variant = "ghost",
  onClick,
  ...props
}: {
  componentName?: string;
  theme?: string;
} & Omit<React.ComponentProps<typeof Button>, "children">) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });
  const isMobile = useIsMobile();

  const runFetch = useCallback(async () => {
    if (!componentName) {
      return;
    }
    setFetchState({ status: "loading" });
    try {
      const res = await fetch(`/api/diff/figma/${theme}/${componentName}`);
      if (res.status === 501) {
        setFetchState({ message: "No Figma token", noToken: true, status: "error" });
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const detail = body.detail ? ` — ${body.detail}` : "";
        setFetchState({
          hint: body.hint,
          message: (body.error ?? `Request failed (${res.status})`) + detail,
          status: "error",
        });
        return;
      }
      const data: DiffResult = await res.json();
      setFetchState({ data, status: "success" });
    } catch {
      setFetchState({ message: "Network error — check your connection.", status: "error" });
    }
  }, [componentName, theme]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (open && fetchState.status === "idle") {
        runFetch();
      }
    },
    [fetchState.status, runFetch],
  );

  const trigger = (
    <Button size={size} variant={variant} className={cn(className)} onClick={onClick} {...props}>
      <GitCompareArrows />
      <span className="hidden sm:inline">Diff</span>
    </Button>
  );

  const title = "Diff with Figma";
  const description = "Compare design tokens between the Figma source file and your local theme.";

  return (
    <>
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={handleOpenChange} sounds>
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <div className="px-0 pb-2">
              <DiffContent state={fetchState} componentName={componentName} />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button size="sm">Done</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={handleOpenChange} sounds>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
            <DialogHeader className="px-5 pt-5 pb-3">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="text-balance">{description}</DialogDescription>
            </DialogHeader>
            <div className="border-t border-border/50">
              <DiffContent state={fetchState} componentName={componentName} />
            </div>
            {(fetchState.status === "error" && !fetchState.noToken) ||
            fetchState.status === "success" ? (
              <DialogFooter className="border-t border-border/50 px-5 py-3">
                <DialogClose asChild>
                  <Button size="sm" variant="outline">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            ) : null}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
