"use client";

import { BracesIcon, ChevronDownIcon } from "lucide-react";
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

import { CopyButton } from "@/components/features/copy-button";
import {
  ChatGptIcon,
  ClaudeIcon,
  FigmaIcon,
  MarkdownDocIcon,
  V0Icon,
} from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { FALLBACK_SITE_ORIGIN, SITE } from "@/constants/site";
import { DEFAULT_REGISTRY_THEME_ID, REGISTRY_THEMES } from "@/lib/themes";

// v0 needs a publicly reachable URL — use production origin even in local dev
const PUBLIC_ORIGIN = process.env.NODE_ENV === "production" ? SITE.URL : FALLBACK_SITE_ORIGIN;

const getPromptUrl = (baseURL: string, markdownUrl: string, themeLabel: string, param = "q") =>
  `${baseURL}?${param}=${encodeURIComponent(
    `I'm building with ${SITE.NAME} — a custom component library (${SITE.URL}).

Active theme: **${themeLabel}**

Read the full component documentation here: ${markdownUrl}

Focus on the **${themeLabel}** Specs section — it contains the exact design tokens, border radius, colour palette, variant meanings, and conventions for this theme.

Based on that, help me use this component correctly in the ${themeLabel} theme.
I may ask you to build a... (e.g. a button, a form, a modal, etc.) using this component.
`,
  )}`;

type MenuItemRenderer = (url: string, markdownUrl: string, themeLabel: string) => React.ReactNode;
const MENU_ITEMS: [string, MenuItemRenderer][] = [
  [
    "markdown",
    (url) => (
      <a href={`${url}.md`} rel="noopener noreferrer" target="_blank">
        <MarkdownDocIcon />
        View as Markdown
      </a>
    ),
  ],
  // [
  //   "cursor",
  //   (_url, markdownUrl, themeLabel) => (
  //     <a
  //       href={getPromptUrl("https://cursor.com/link/prompt", markdownUrl, themeLabel, "text")}
  //       rel="noopener noreferrer"
  //       target="_blank"
  //     >
  //       <CursorIcon />
  //       Open in Cursor
  //     </a>
  //   ),
  // ],
  [
    "chatgpt",
    (_url, markdownUrl, themeLabel) => (
      <a
        href={getPromptUrl("https://chatgpt.com", markdownUrl, themeLabel)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ChatGptIcon />
        Open in ChatGPT
      </a>
    ),
  ],
  [
    "claude",
    (_url, markdownUrl, themeLabel) => (
      <a
        href={getPromptUrl("https://claude.ai/new", markdownUrl, themeLabel)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ClaudeIcon />
        Open in Claude
      </a>
    ),
  ],
  // [
  //   "perplexity",
  //   (_url, markdownUrl, themeLabel) => (
  //     <a
  //       href={getPromptUrl("https://perplexity.ai", markdownUrl, themeLabel)}
  //       rel="noopener noreferrer"
  //       target="_blank"
  //     >
  //       <PerplexityIcon />
  //       Open in Perplexity
  //     </a>
  //   ),
  // ],
  // [
  //   "gemini",
  //   (_url, markdownUrl, themeLabel) => (
  //     <a
  //       href={getPromptUrl("https://gemini.google.com/app", markdownUrl, themeLabel)}
  //       rel="noopener noreferrer"
  //       target="_blank"
  //     >
  //       <GeminiIcon />
  //       Open in Gemini
  //     </a>
  //   ),
  // ],
  // [
  //   "grok",
  //   (_url, markdownUrl, themeLabel) => (
  //     <a
  //       href={getPromptUrl("https://grok.com", markdownUrl, themeLabel)}
  //       rel="noopener noreferrer"
  //       target="_blank"
  //     >
  //       <GrokIcon />
  //       Open in Grok
  //     </a>
  //   ),
  // ],
  // [
  //   "scira",
  //   (_url, markdownUrl, themeLabel) => (
  //     <a
  //       className="m-0 p-0"
  //       href={getPromptUrl("https://scira.ai/", markdownUrl, themeLabel)}
  //       rel="noopener noreferrer"
  //       target="_blank"
  //     >
  //       <SciraIcon />
  //       Open in Scira AI
  //     </a>
  //   ),
  // ],
];

export const DocsCopyPage = ({
  markdownUrl,
  url,
  figmaUrl,
}: {
  markdownUrl: string;
  url: string;
  figmaUrl?: string;
}) => {
  const searchParams = useSearchParams();
  const themeParam = searchParams.get("theme");
  const currentTheme = REGISTRY_THEMES.some((t) => t.id === themeParam)
    ? (themeParam ?? DEFAULT_REGISTRY_THEME_ID)
    : DEFAULT_REGISTRY_THEME_ID;
  const currentThemeConfig = REGISTRY_THEMES.find((t) => t.id === currentTheme);
  const currentThemeLabel = currentThemeConfig?.label ?? "New York";
  const effectiveFigmaUrl = currentThemeConfig?.figma ?? figmaUrl;

  // Extract component slug from URL (e.g. /docs/components/button → button)
  const componentSlug = url.split("/").pop()?.split("?")[0] ?? "";
  // Always use the public origin — v0 needs to fetch the URL, so localhost won't work
  const registryApiUrl = `${PUBLIC_ORIGIN}/api/registry/${currentTheme}/${componentSlug}`;
  const v0Url = `https://v0.dev/chat/api/open?url=${encodeURIComponent(registryApiUrl)}`;

  const copyValue = useCallback(async () => {
    const response = await fetch(markdownUrl);
    const text = await response.text();
    if (currentTheme === DEFAULT_REGISTRY_THEME_ID) {
      return text;
    }
    return `> Theme: **${currentThemeLabel}**\n\n${text}`;
  }, [markdownUrl, currentTheme, currentThemeLabel]);

  const trigger = (
    <Button
      variant="secondary"
      size="sm"
      className="peer -ml-0.5 size-8 md:size-7 md:text-[0.8rem]"
    >
      <ChevronDownIcon className="rotate-180 sm:rotate-0" />
    </Button>
  );

  return (
    <Popover sounds>
      <div className="group/buttons relative flex rounded-lg bg-secondary *:data-[slot=button]:focus-visible:relative *:data-[slot=button]:focus-visible:z-10">
        <PopoverAnchor />
        <CopyButton
          value={copyValue}
          showTooltip={false}
          sound="copy"
          variant="secondary"
          className="md:h-7 md:text-[0.8rem]"
        >
          Copy Page
        </CopyButton>
        <DropdownMenu sounds>
          <DropdownMenuTrigger asChild className="hidden sm:flex">
            {trigger}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="animate-none! rounded-lg shadow-none">
            {effectiveFigmaUrl && (
              <DropdownMenuItem asChild sound="click">
                <a href={effectiveFigmaUrl} rel="noopener noreferrer" target="_blank">
                  <FigmaIcon />
                  View in Figma
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild sound="click">
              <a href={v0Url} rel="noopener noreferrer" target="_blank">
                <V0Icon />
                <span className="-translate-x-0.5">Open in v0</span>
              </a>
            </DropdownMenuItem>
            {componentSlug && (
              <DropdownMenuItem asChild sound="click">
                <a href={registryApiUrl} rel="noopener noreferrer" target="_blank">
                  <BracesIcon />
                  Open in JSON
                </a>
              </DropdownMenuItem>
            )}
            {MENU_ITEMS.map(([key, render]) => (
              <DropdownMenuItem key={key} asChild sound="click">
                {render(url, markdownUrl, currentThemeLabel)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator
          orientation="vertical"
          className="absolute top-1 right-8 z-0 h-6! bg-foreground/5! peer-focus-visible:opacity-0 sm:right-7 sm:h-5!"
        />
        <PopoverTrigger asChild className="flex sm:hidden">
          {trigger}
        </PopoverTrigger>
        <PopoverContent
          className="w-52 origin-center! rounded-lg bg-background/70 p-1 shadow-none backdrop-blur-sm dark:bg-background/60"
          align="start"
        >
          {effectiveFigmaUrl && (
            <Button
              variant="ghost"
              size="lg"
              asChild
              sound="click"
              className="w-full justify-start text-base font-normal *:[svg]:text-muted-foreground"
            >
              <a href={effectiveFigmaUrl} rel="noopener noreferrer" target="_blank">
                <FigmaIcon />
                View in Figma
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            size="lg"
            asChild
            sound="click"
            className="w-full justify-start text-base font-normal *:[svg]:text-muted-foreground"
          >
            <a href={v0Url} rel="noopener noreferrer" target="_blank">
              <V0Icon />
              <span className="-translate-x-0.5">Open in v0</span>
            </a>
          </Button>
          {componentSlug && (
            <Button
              variant="ghost"
              size="lg"
              asChild
              sound="click"
              className="w-full justify-start text-base font-normal *:[svg]:text-muted-foreground"
            >
              <a href={registryApiUrl} rel="noopener noreferrer" target="_blank">
                <BracesIcon />
                Open in JSON
              </a>
            </Button>
          )}
          {MENU_ITEMS.map(([key, render]) => (
            <Button
              variant="ghost"
              size="lg"
              asChild
              key={key}
              sound="click"
              className="w-full justify-start text-base font-normal *:[svg]:text-muted-foreground"
            >
              {render(url, markdownUrl, currentThemeLabel)}
            </Button>
          ))}
        </PopoverContent>
      </div>
    </Popover>
  );
};
