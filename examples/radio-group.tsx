import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function RadioGroupDemo() {
  return (
    <div className="flex flex-col gap-8">
      {/* Vertical (default) */}
      <RadioGroup defaultValue="comfortable">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="default" id="r-default" />
          <Label htmlFor="r-default">Default</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="comfortable" id="r-comfortable" />
          <Label htmlFor="r-comfortable">Comfortable</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="compact" id="r-compact" />
          <Label htmlFor="r-compact">Compact</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="disabled" id="r-disabled" disabled />
          <Label htmlFor="r-disabled">Disabled option</Label>
        </div>
      </RadioGroup>

      {/* Horizontal */}
      <RadioGroup defaultValue="card" className="flex gap-6">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="card" id="r-card" />
          <Label htmlFor="r-card">Card</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="paypal" id="r-paypal" />
          <Label htmlFor="r-paypal">PayPal</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="apple" id="r-apple" />
          <Label htmlFor="r-apple">Apple Pay</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
