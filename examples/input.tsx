import { Input } from "@/components/ui/input";

export function InputDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input placeholder="Email address" />
      <Input type="password" placeholder="Password" />
      <Input disabled placeholder="Disabled" />
      <Input aria-invalid placeholder="Invalid value" defaultValue="bad@" />
      <Input type="file" />
    </div>
  );
}
