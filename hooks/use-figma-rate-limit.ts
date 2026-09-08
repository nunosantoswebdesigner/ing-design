"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "figma-diff-rate-limited-until";

const readStoredRetryAt = (): number | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const value = raw ? Number.parseInt(raw, 10) : null;
    return value && value > Date.now() ? value : null;
  } catch {
    return null;
  }
};

/** Tracks Figma's shared, account-wide rate limit across every Diff button on
 * the site — persisted in localStorage so hitting a 429 on one component page
 * still warns on the next one, instead of everyone re-discovering it by
 * clicking Diff and waiting for it to fail. */
export const useFigmaRateLimit = () => {
  const [retryAt, setRetryAt] = useState<number | null>(null);

  useEffect(() => {
    setRetryAt(readStoredRetryAt());
  }, []);

  const markRateLimited = useCallback((retryAfterSeconds: number) => {
    const at = Date.now() + retryAfterSeconds * 1000;
    setRetryAt(at);
    try {
      localStorage.setItem(STORAGE_KEY, String(at));
    } catch {
      // localStorage unavailable (private mode, etc.) — in-memory state still works for this tab.
    }
  }, []);

  return { isRateLimited: retryAt !== null, markRateLimited, retryAt };
};

/** "resets in ~3d 4h" / "resets in ~12 min" — coarse on purpose, this is a
 * heads-up, not a countdown timer. */
export const formatRetryEta = (retryAt: number): string => {
  const ms = Math.max(0, retryAt - Date.now());
  const minutes = Math.round(ms / 60_000);
  if (minutes < 1) {
    return "resets any moment now";
  }
  if (minutes < 60) {
    return `resets in ~${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `resets in ~${hours}h ${minutes % 60}m`;
  }
  const days = Math.floor(hours / 24);
  return `resets in ~${days}d ${hours % 24}h`;
};
