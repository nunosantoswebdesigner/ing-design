export const GITHUB = {
  branch: "main",
  org: "nunosantoswebdesigner",
  repo: "ing-design",
  user: "nunosantoswebdesigner",
} as const;

const githubUrl = `https://github.com/${GITHUB.org}/${GITHUB.repo}`;

export const LINK = {
  DISCORD: "https://discord.gg/Abt7ENBR",
  GITHUB: githubUrl,
  LICENSE: `${githubUrl}/blob/${GITHUB.branch}/LICENSE`,
  PORTFOLIO: "https://github.com/nunosantoswebdesigner",
  SHADCN_MCP_DOCS: "https://ui.shadcn.com/docs/mcp",
  SPONSOR: `https://github.com/sponsors/${GITHUB.user}`,
  X: "",
  X_SHADCN_LABS: "",
} as const;
