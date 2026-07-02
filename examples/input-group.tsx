import { Copy, DollarSign, Globe, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";

export const InputGroupDemo = () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {/* Icon prefix */}
      <InputGroup>
        <InputGroupText><Search /></InputGroupText>
        <Input placeholder="Search..." />
      </InputGroup>
      {/* Text prefix */}
      <InputGroup>
        <InputGroupText><Globe /></InputGroupText>
        <InputGroupText className="text-muted-foreground/60">https://</InputGroupText>
        <Input placeholder="example.com" />
      </InputGroup>
      {/* Currency prefix + text suffix */}
      <InputGroup>
        <InputGroupText><DollarSign /></InputGroupText>
        <Input type="number" placeholder="0.00" />
        <InputGroupText>USD</InputGroupText>
      </InputGroup>
      {/* Input + button suffix */}
      <InputGroup>
        <Input defaultValue="https://ing.design/r/button" readOnly />
        <Button variant="outline">
          <Copy />
          Copy
        </Button>
      </InputGroup>
    </div>
  );
