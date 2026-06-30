import { unstable_cache } from "next/cache";

import { GITHUB } from "@/constants/links";

interface Stargazer {
  login: string;
  avatar_url: string;
}

const githubHeaders = () => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

const REPO_CACHE_KEY = `${GITHUB.org}/${GITHUB.repo}`;

export const getStargazers = unstable_cache(
  async (): Promise<Stargazer[]> => {
    try {
      const pages: Stargazer[] = [];
      let page = 1;

      while (page <= 5) {
        const response = await fetch(
          `https://api.github.com/repos/${GITHUB.org}/${GITHUB.repo}/stargazers?per_page=100&page=${page}`,
          { headers: githubHeaders() },
        );

        if (!response.ok) {
          break;
        }

        const data: Stargazer[] = await response.json();
        if (data.length === 0) {
          break;
        }

        pages.push(...data);
        if (data.length < 100) {
          break;
        }
        page += 1;
      }

      return pages.filter((s) => s.login !== GITHUB.user);
    } catch {
      return [];
    }
  },
  [`github-stargazers-${REPO_CACHE_KEY}`],
  { revalidate: 86_400 },
);

export const getStargazerCount = unstable_cache(
  async () => {
    try {
      const response = await fetch(`https://api.github.com/repos/${GITHUB.org}/${GITHUB.repo}`, {
        headers: githubHeaders(),
      });

      if (!response.ok) {
        return 0;
      }

      const json = (await response.json()) as { stargazers_count?: number };
      return Number(json.stargazers_count) || 0;
    } catch {
      return 0;
    }
  },
  [`github-stargazer-count-${REPO_CACHE_KEY}`],
  { revalidate: 86_400 },
);
