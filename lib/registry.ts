import path from "node:path";

import { readFileFromRoot } from "@/lib/read-file";

export const readOptionalFromRoot = async (
  relativePath: string
): Promise<string | null> => {
  try {
    return await readFileFromRoot(relativePath);
  } catch {
    return null;
  }
};

export const getRegistryUiSourceCandidates = ({ name }: { name: string }) => [
  path.join("registry", "new-york", `${name}.tsx`),
];

// The demo file needs "use client" to actually render inside this (Next.js)
// docs site, but the code shown in "View Code" is meant to be copied into any
// React app — where that directive is Next.js-specific noise. Strip it only
// from the displayed text, not from the file used for the live preview.
const stripUseClientDirective = (code: string): string =>
  code.replace(/^"use client";\n+/, "");

export const getDemoSource = async (name: string): Promise<string | null> => {
  const code = await readOptionalFromRoot(path.join("examples", `${name}.tsx`));
  return code ? stripUseClientDirective(code) : code;
};

export const getRegistrySource = async (
  name: string
): Promise<string | null> => {
  const candidates = getRegistryUiSourceCandidates({ name });

  for (const candidate of candidates) {
    const code = await readOptionalFromRoot(candidate);
    if (code) {
      return code;
    }
  }

  return null;
};
