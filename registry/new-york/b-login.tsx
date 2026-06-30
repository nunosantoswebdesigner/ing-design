"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AuthHeader,
  AuthDivider,
  AuthSocial,
  AuthFooter,
  type AuthProvider,
} from "@/components/ui/e-auth";

interface LoginBlockProps {
  layout?: "card" | "split" | "centered";
  logo?: React.ReactNode;
  social?: AuthProvider[];
  socialStyle?: "buttons" | "icons";
  socialPosition?: "top" | "bottom";
  image?: React.ReactNode;
  showTerms?: boolean;
  onLogin?: (data: { email: string; password: string }) => void;
  onSocialLogin?: (provider: AuthProvider) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  registerHref?: string;
  forgotPasswordHref?: string;
  className?: string;
}

// ─── Inner form (shared across layouts) ─────────────────────────────────────

function LoginForm({
  logo,
  social = [],
  socialStyle = "buttons",
  socialPosition = "bottom",
  showTerms,
  onLogin,
  onSocialLogin,
  onForgotPassword,
  onRegister,
  registerHref,
  forgotPasswordHref,
  centered,
}: Omit<LoginBlockProps, "layout" | "image" | "className"> & { centered?: boolean }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.({ email, password });
  };

  return (
    <div className="flex flex-col gap-6">
      <AuthHeader
        logo={logo}
        heading="Login to your account"
        description="Enter your email below to login to your account"
        centered={centered}
      />

      {social.length > 0 && socialPosition === "top" && (
        <>
          <AuthSocial providers={social} style={socialStyle} onProvider={onSocialLogin} />
          <AuthDivider />
        </>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            {forgotPasswordHref ? (
              <a
                href={forgotPasswordHref}
                className="text-sm underline underline-offset-4 hover:text-foreground text-muted-foreground"
              >
                Forgot password?
              </a>
            ) : (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm underline underline-offset-4 hover:text-foreground text-muted-foreground"
              >
                Forgot password?
              </button>
            )}
          </div>
          <Input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>

      {social.length > 0 && socialPosition === "bottom" && (
        <>
          <AuthDivider />
          <AuthSocial providers={social} style={socialStyle} onProvider={onSocialLogin} />
        </>
      )}

      <AuthFooter
        mode="login"
        onSwitch={onRegister}
        switchHref={registerHref}
        showTerms={showTerms}
      />
    </div>
  );
}

// ─── LoginBlock ──────────────────────────────────────────────────────────────

function LoginBlock({
  layout = "card",
  logo,
  social = ["google"],
  socialStyle = "buttons",
  socialPosition = "bottom",
  image,
  showTerms,
  onLogin,
  onSocialLogin,
  onForgotPassword,
  onRegister,
  registerHref,
  forgotPasswordHref,
  className,
}: LoginBlockProps) {
  const formProps = {
    logo,
    social,
    socialStyle,
    socialPosition,
    showTerms,
    onLogin,
    onSocialLogin,
    onForgotPassword,
    onRegister,
    registerHref,
    forgotPasswordHref,
  };

  if (layout === "split") {
    return (
      <div
        data-slot="login-block"
        data-layout="split"
        className={cn("grid min-h-svh lg:grid-cols-2", className)}
      >
        <div className="flex flex-col gap-6 p-8 lg:p-10">
          {logo && <div>{logo}</div>}
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md">
              <LoginForm {...formProps} logo={undefined} />
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          {image && (
            <div className="absolute inset-0 overflow-hidden">
              {image}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (layout === "centered") {
    return (
      <div
        data-slot="login-block"
        data-layout="centered"
        className={cn(
          "bg-background flex min-h-svh flex-col items-center justify-center p-8",
          className
        )}
      >
        <div className="w-full max-w-md">
          <LoginForm {...formProps} centered />
        </div>
      </div>
    );
  }

  // card (default)
  return (
    <div
      data-slot="login-block"
      data-layout="card"
      className={cn(
        "bg-background flex min-h-svh items-center justify-center p-6 md:p-10",
        className
      )}
    >
      <div className="w-full max-w-sm">
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <LoginForm {...formProps} />
        </div>
      </div>
    </div>
  );
}

export { LoginBlock };
export type { LoginBlockProps };
