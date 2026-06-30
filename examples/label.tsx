import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LabelDemo() {
  return (
    <div className="flex flex-col gap-6">
      {/* Basic label + input */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>

      {/* Required */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">
          Username
          <span className="text-destructive">*</span>
        </Label>
        <Input id="username" placeholder="johndoe" />
      </div>

      {/* Disabled — peer-disabled styling */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="disabled-input">Disabled field</Label>
        <Input id="disabled-input" disabled placeholder="Not available" />
      </div>

      {/* With icon */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="avatar" className="cursor-pointer">
          <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
            NS
          </span>
          Display name
        </Label>
        <Input id="avatar" placeholder="Nuno Santos" />
      </div>
    </div>
  );
}
