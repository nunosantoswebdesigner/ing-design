import { Separator } from "@/components/ui/separator";

export const SeparatorDemo = () => (
    <div className="flex flex-col gap-8">
      {/* Horizontal in text context */}
      <div className="w-full max-w-xs">
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">ING Design</h4>
          <p className="text-muted-foreground text-sm">A component registry built on shadcn/ui.</p>
        </div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center gap-4 text-sm">
          <span>Blog</span>
          <Separator orientation="vertical" />
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Source</span>
        </div>
      </div>
      {/* Between list items */}
      <div className="w-full max-w-xs divide-y">
        {["Profile", "Billing", "Settings", "Logout"].map((item) => (
          <div key={item} className="py-2.5 text-sm">{item}</div>
        ))}
      </div>
    </div>
  );
