"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── Brand SVG icons (inline — no external dep) ─────────────────────────────

function GoogleIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("size-4", className)} {...props}>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function GithubIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("size-4", className)} {...props}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const BRAND_ICONS = {
  apple: AppleIcon,
  github: GithubIcon,
  google: GoogleIcon,
} as const;

const BRAND_LABELS = {
  apple: "Apple",
  github: "GitHub",
  google: "Google",
} as const;

export type AuthProvider = keyof typeof BRAND_ICONS;

// ─── AuthHeader ──────────────────────────────────────────────────────────────

interface AuthHeaderProps {
  logo?: React.ReactNode;
  heading: string;
  description?: React.ReactNode;
  className?: string;
  centered?: boolean;
}

function AuthHeader({ logo, heading, description, className, centered }: AuthHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", centered && "items-center text-center", className)}>
      {logo && <div className="mb-2">{logo}</div>}
      <h1 className="text-xl font-semibold tracking-tight">{heading}</h1>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

// ─── AuthDivider ─────────────────────────────────────────────────────────────

interface AuthDividerProps {
  text?: string;
  className?: string;
}

function AuthDivider({ text = "or continue with", className }: AuthDividerProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">{text}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

// ─── AuthSocial ──────────────────────────────────────────────────────────────

interface AuthSocialProps {
  providers?: AuthProvider[];
  style?: "buttons" | "icons";
  onProvider?: (provider: AuthProvider) => void;
  className?: string;
}

function AuthSocial({
  providers = ["google"],
  style = "buttons",
  onProvider,
  className,
}: AuthSocialProps) {
  if (style === "icons") {
    return (
      <div className={cn("flex justify-center gap-2", className)}>
        {providers.map((provider) => {
          const Icon = BRAND_ICONS[provider];
          return (
            <Button
              key={provider}
              variant="outline"
              size="icon"
              type="button"
              aria-label={`Continue with ${BRAND_LABELS[provider]}`}
              onClick={() => onProvider?.(provider)}
            >
              <Icon />
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {providers.map((provider) => {
        const Icon = BRAND_ICONS[provider];
        return (
          <Button
            key={provider}
            variant="outline"
            className="w-full"
            type="button"
            onClick={() => onProvider?.(provider)}
          >
            <Icon />
            Continue with {BRAND_LABELS[provider]}
          </Button>
        );
      })}
    </div>
  );
}

// ─── AuthFooter ──────────────────────────────────────────────────────────────

interface AuthFooterProps {
  mode: "login" | "register";
  onSwitch?: () => void;
  switchHref?: string;
  showTerms?: boolean;
  className?: string;
}

function AuthFooter({ mode, onSwitch, switchHref, showTerms, className }: AuthFooterProps) {
  const switchText = mode === "login" ? "Don't have an account?" : "Already have an account?";
  const switchLabel = mode === "login" ? "Sign up" : "Sign in";

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <p className="text-sm text-muted-foreground">
        {switchText}{" "}
        {switchHref ? (
          <a
            href={switchHref}
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            {switchLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={onSwitch}
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            {switchLabel}
          </button>
        )}
      </p>
      {showTerms && (
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">
            Privacy Policy
          </a>
          .
        </p>
      )}
    </div>
  );
}

export { AuthHeader, AuthDivider, AuthSocial, AuthFooter, GoogleIcon, AppleIcon, GithubIcon };
