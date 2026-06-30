import { createHash } from "node:crypto";

import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";

export const SITE_AGENT_SKILL_MD = `# ${SITE.NAME}

## What This Is

${SITE.NAME} is a custom component library and public shadcn registry built by ING Infinitive. Components are distributed via the shadcn registry model — you copy the source code directly into your project, own it fully, and customize it without constraints.

Components are built on Radix UI primitives, styled with Tailwind CSS 4, and documented with live previews, code toggles, and structured AI-ready specs. Brand themes (Force8, My Swiss Ski, My Ice Hockey) are applied via CSS variable overrides — no code duplication between themes.

## Who This Is For

- Developers building projects under the ING Infinitive umbrella
- Anyone looking for accessible, production-ready React components in a copy-owned model
- AI tools that need component context for generation, theming, or integration tasks

## What's Available

### Components
Foundational UI primitives — buttons, inputs, dialogs, selects, and more. Each component page includes:
- Live preview with per-brand theme switcher
- Source code view
- Props reference table
- Usage examples
- AI-ready Specs block (design tokens, Tailwind conventions, variant reference)

### Blocks
Pre-assembled UI sections built from the component library — cards, modals, stat panels, and reusable layout patterns.

### Elements
Complex, data-driven components — data tables, calendars, charts, and dashboard widgets.

## How to Install a Component

\`\`\`bash
npx shadcn@latest add ${SITE.URL}/r/<component-name>.json
\`\`\`

Full installation guide: ${SITE.URL}${ROUTES.DOCS_INSTALLATION}

## Key URLs

- Documentation: ${SITE.URL}${ROUTES.DOCS}
- Components: ${SITE.URL}${ROUTES.DOCS_COMPONENTS}
- Registry index: ${SITE.URL}${ROUTES.REGISTRY}
- LLM index: ${SITE.URL}${ROUTES.LLMS}
- Full LLM export: ${SITE.URL}${ROUTES.LLMS_FULL}
- OpenAPI: ${SITE.URL}${ROUTES.OPENAPI}

## Machine-Readable Access

Every documentation page is available as Markdown by appending \`.md\` to its URL, or by sending an \`Accept: text/markdown\` header. This applies to all pages under \`/docs\`.

Example: \`${SITE.URL}${ROUTES.DOCS_COMPONENTS}/button.md\`

## MCP

This site is a shadcn-compatible registry. For MCP workflows, use the maintained shadcn MCP server: ${LINK.SHADCN_MCP_DOCS}

## Themes

Brand themes are CSS variable overrides, not separate component implementations. The base component (New York) is the source of truth. Themes change visual identity — colour, radius, typography weight — without touching component logic.

Available themes: \`new-york\` (base), \`force8\`, \`myswissski\`, \`myicehockey\`
`;

export const siteAgentSkillDigest = (): string => {
  const hex = createHash("sha256")
    .update(SITE_AGENT_SKILL_MD, "utf-8")
    .digest("hex");

  return `sha256:${hex}`;
};
