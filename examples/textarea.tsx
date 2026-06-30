import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TextareaDemo() {
  return (
    <div className="flex flex-col gap-6">
      {/* Default */}
      <Textarea placeholder="Write something…" />

      {/* With label */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ta-bio">Bio</Label>
        <Textarea id="ta-bio" placeholder="Tell us about yourself" className="min-h-24" />
      </div>

      {/* With label and helper + button */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ta-message">Message</Label>
        <Textarea id="ta-message" placeholder="Your message…" className="min-h-28" />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">Max 500 characters</span>
          <Button size="sm">Send</Button>
        </div>
      </div>

      {/* Disabled */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ta-disabled">Disabled</Label>
        <Textarea id="ta-disabled" defaultValue="This field is read-only." disabled />
      </div>

      {/* Invalid */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ta-invalid">Feedback</Label>
        <Textarea id="ta-invalid" placeholder="Describe the issue…" aria-invalid />
        <span className="text-destructive text-xs">This field is required.</span>
      </div>
    </div>
  );
}
