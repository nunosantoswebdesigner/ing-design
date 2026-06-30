import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">Years</Button>
      <Button variant="outline">Months</Button>
      <Button variant="outline">Days</Button>
    </ButtonGroup>
  );
}
