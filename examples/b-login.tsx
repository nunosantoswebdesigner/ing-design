"use client";
import { LoginBlock } from "@/components/ui/b-login";

export const BLoginDemo = () => (
    <LoginBlock
      layout="card"
      social={["google", "github"]}
      socialStyle="buttons"
      onLogin={(data) => console.log("login", data)}
      onForgotPassword={() => console.log("forgot")}
      onRegister={() => console.log("switch to register")}
    />
  );
