"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeader, AuthDivider, AuthSocial, AuthFooter } from '@/components/ui/e-auth';
import type { AuthProvider } from '@/components/ui/e-auth';

interface SignupBlockProps {
  layout?: "card" | "split" | "centered";
  logo?: React.ReactNode;
  social?: AuthProvider[];
  socialStyle?: "buttons" | "icons";
  socialPosition?: "top" | "bottom";
  image?: React.ReactNode;
  showTerms?: boolean;
  showName?: boolean;
  showConfirmPassword?: boolean;
  emailHelperText?: string;
  passwordHelperText?: string;
  confirmPasswordHelperText?: string;
  onSignup?: (data: {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) => void;
  onSocialLogin?: (provider: AuthProvider) => void;
  onLogin?: () => void;
  loginHref?: string;
  className?: string;
}

function SignupForm({
  logo,
  social = [],
  socialStyle = "buttons",
  socialPosition = "bottom",
  showTerms,
  showName = true,
  showConfirmPassword = true,
  emailHelperText = "We'll use this to contact you. We will not share your email with anyone else.",
  passwordHelperText = "Must be at least 8 characters long.",
  confirmPasswordHelperText = "Must be at least 8 characters long.",
  onSignup,
  onSocialLogin,
  onLogin,
  loginHref,
  centered,
}: Omit<SignupBlockProps, "layout" | "image" | "className"> & { centered?: boolean }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup?.({
      confirmPassword: showConfirmPassword ? confirmPassword : undefined,
      email,
      name: showName ? name : undefined,
      password,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <AuthHeader
        logo={logo}
        heading="Create an account"
        description="Fill in the form below to create your account."
        centered={centered}
      />

      {social.length > 0 && socialPosition === "top" && (
        <>
          <AuthSocial providers={social} style={socialStyle} onProvider={onSocialLogin} />
          <AuthDivider text="OR CONTINUE WITH" />
        </>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {showName && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-name">Full Name</Label>
            <Input
              id="signup-name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailHelperText && <p className="text-xs text-muted-foreground">{emailHelperText}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordHelperText && (
            <p className="text-xs text-muted-foreground">{passwordHelperText}</p>
          )}
        </div>

        {showConfirmPassword && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-confirm">Confirm Password</Label>
            <Input
              id="signup-confirm"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordHelperText && (
              <p className="text-xs text-muted-foreground">{confirmPasswordHelperText}</p>
            )}
          </div>
        )}

        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>

      {social.length > 0 && socialPosition === "bottom" && (
        <>
          <AuthDivider text="OR CONTINUE WITH" />
          <AuthSocial providers={social} style={socialStyle} onProvider={onSocialLogin} />
        </>
      )}

      <AuthFooter mode="register" onSwitch={onLogin} switchHref={loginHref} showTerms={showTerms} />
    </div>
  );
}

function SignupBlock({
  layout = "split",
  logo,
  social = ["github"],
  socialStyle = "buttons",
  socialPosition = "bottom",
  image,
  showTerms,
  showName = true,
  showConfirmPassword = true,
  emailHelperText,
  passwordHelperText,
  confirmPasswordHelperText,
  onSignup,
  onSocialLogin,
  onLogin,
  loginHref,
  className,
}: SignupBlockProps) {
  const formProps = {
    confirmPasswordHelperText,
    emailHelperText,
    loginHref,
    logo,
    onLogin,
    onSignup,
    onSocialLogin,
    passwordHelperText,
    showConfirmPassword,
    showName,
    showTerms,
    social,
    socialPosition,
    socialStyle,
  };

  if (layout === "split") {
    return (
      <div
        data-slot="signup-block"
        data-layout="split"
        className={cn("grid min-h-svh lg:grid-cols-2", className)}
      >
        <div className="flex flex-col gap-6 p-8 lg:p-10">
          {logo && <div>{logo}</div>}
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">
              <SignupForm {...formProps} logo={undefined} centered />
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          {image && <div className="absolute inset-0 overflow-hidden">{image}</div>}
        </div>
      </div>
    );
  }

  if (layout === "centered") {
    return (
      <div
        data-slot="signup-block"
        data-layout="centered"
        className={cn(
          "bg-background flex min-h-svh flex-col items-center justify-center p-8",
          className,
        )}
      >
        <div className="w-full max-w-sm">
          <SignupForm {...formProps} centered />
        </div>
      </div>
    );
  }

  return (
    <div
      data-slot="signup-block"
      data-layout="card"
      className={cn(
        "bg-background flex min-h-svh items-center justify-center p-6 md:p-10",
        className,
      )}
    >
      <div className="w-full max-w-sm">
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <SignupForm {...formProps} />
        </div>
      </div>
    </div>
  );
}

export { SignupBlock };
export type { SignupBlockProps };
export default SignupBlock;
