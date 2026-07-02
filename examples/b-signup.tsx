"use client";
import { SignupBlock } from "@/components/ui/b-signup";

export const BSignupDemo = () => (
    <SignupBlock
      layout="split"
      social={["github"]}
      onSignup={(data) => console.log("signup", data)}
      onLogin={() => console.log("switch to login")}
    />
  );
