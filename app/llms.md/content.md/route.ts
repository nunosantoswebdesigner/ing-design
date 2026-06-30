import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { AGENT_DOCS_DIRECTIVE_MARKDOWN } from "@/lib/agent-discovery/directive";
import { requestOrigin } from "@/lib/agent-discovery/request-origin";
import { markdownResponse } from "@/lib/api";

export const revalidate = false;

const homepageMarkdown = (origin: string): string => {
  const base = origin.replace(/\/$/, "");

  return `# ${SITE.NAME}

${SITE.DESCRIPTION.LONG}

${AGENT_DOCS_DIRECTIVE_MARKDOWN}

## What Is ING Design

ING Design is a custom component library and shadcn-compatible registry built by ING Infinitive. Components are distributed via the copy-owned model — you install the source code directly into your project with \`npx shadcn add\`, own it fully, and customize it without constraints or library lock-in.

Components are built on Radix UI primitives for accessibility, styled with Tailwind CSS 4 using CSS variables, and documented with live previews and AI-ready spec blocks. Brand themes are applied via CSS variable overrides and are completely optional.

## What's Available

- **Components** — Foundational UI primitives: Button, Input, Dialog, Select, Sidebar, and more. No prefix.
- **Elements** (\`e-\` prefix) — Complex data-driven components: data tables, calendars, auth forms. Installed as \`npx shadcn add registry/e-data-table\`.
- **Blocks** (\`b-\` prefix) — Pre-assembled page sections: login, signup, featured layouts. Installed as \`npx shadcn add registry/b-login\`.

## Themes

Each component ships in four themes: **New York** (base), **Force8**, **My Swiss Ski**, and **My Ice Hockey**. Themes override CSS variables — no component code changes required.

## Figma Diff

The built-in Figma diff tool compares design tokens between a Figma file and the local theme. Accessible via the **Diff** button on any component page. Requires \`FIGMA_ACCESS_TOKEN\` in \`.env.local\`.

## Quick Links

- [Get started — installation guide](${base}${ROUTES.DOCS_INSTALLATION}.md)
- [Browse all components](${base}${ROUTES.DOCS_COMPONENTS}.md)
- [Full documentation](${base}${ROUTES.DOCS}.md)
- [LLM index (llms.txt)](${base}${ROUTES.LLMS})
- [Full LLM export (llms-full.txt)](${base}${ROUTES.LLMS_FULL})
- [API catalog](${base}${ROUTES.API_CATALOG})
- [OpenAPI description](${base}${ROUTES.OPENAPI})
- [Agent skills index](${base}${ROUTES.AGENT_SKILLS_INDEX})
- [Component registry](${base}${ROUTES.REGISTRY})

## Machine-Readable Access

Every documentation page is available as Markdown by appending \`.md\` to its URL.
Example: \`${base}${ROUTES.DOCS_COMPONENTS}/button.md\`
`;
};

export const GET = (request: Request) => {
  const body = homepageMarkdown(requestOrigin(request));

  return markdownResponse(body, true);
};

export const HEAD = (request: Request) => {
  const body = homepageMarkdown(requestOrigin(request));

  return markdownResponse(body, false);
};
