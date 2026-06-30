import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type PackageManager = "npm" | "pnpm" | "yarn" | "vite";

const packageManagerAtom = atomWithStorage<PackageManager>(
  "package-manager",
  "npm"
);

export const usePackageManager = () => useAtom(packageManagerAtom);
