import {
  Bell,
  ChevronRight,
  CreditCard,
  Lock,
  Mail,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemAction,
  ItemContent,
  ItemDescription,
  ItemIcon,
  ItemLabel,
} from "@/components/ui/item";

export function ItemDemo() {
  return (
    <div className="w-full max-w-sm divide-y">
      {/* Icon + label only */}
      <Item>
        <ItemIcon>
          <User />
        </ItemIcon>
        <ItemContent>
          <ItemLabel>Profile</ItemLabel>
        </ItemContent>
      </Item>

      {/* Icon + label + description */}
      <Item>
        <ItemIcon>
          <Mail />
        </ItemIcon>
        <ItemContent>
          <ItemLabel>Email</ItemLabel>
          <ItemDescription>nuno@example.com</ItemDescription>
        </ItemContent>
      </Item>

      {/* With badge action */}
      <Item>
        <ItemIcon>
          <Bell />
        </ItemIcon>
        <ItemContent>
          <ItemLabel>Notifications</ItemLabel>
          <ItemDescription>Push and email alerts</ItemDescription>
        </ItemContent>
        <ItemAction>
          <Badge>3</Badge>
        </ItemAction>
      </Item>

      {/* With chevron (interactive via asChild) */}
      <Item asChild>
        <button className="w-full cursor-pointer hover:bg-muted/50 rounded-md px-2 -mx-2 transition-colors">
          <ItemIcon>
            <Lock />
          </ItemIcon>
          <ItemContent>
            <ItemLabel>Security</ItemLabel>
            <ItemDescription>Password and 2FA</ItemDescription>
          </ItemContent>
          <ItemAction>
            <ChevronRight className="size-4 text-muted-foreground" />
          </ItemAction>
        </button>
      </Item>

      {/* No icon */}
      <Item>
        <ItemContent>
          <ItemLabel>Billing</ItemLabel>
          <ItemDescription>Manage your subscription</ItemDescription>
        </ItemContent>
        <ItemAction>
          <CreditCard className="size-4 text-muted-foreground" />
        </ItemAction>
      </Item>
    </div>
  );
}
