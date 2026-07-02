import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyAction, EmptyDescription, EmptyIcon, EmptyTitle } from "@/components/ui/empty";

export const EmptyDemo = () => (
    <Empty>
      <EmptyIcon><Inbox /></EmptyIcon>
      <EmptyTitle>No messages yet</EmptyTitle>
      <EmptyDescription>When you receive messages they'll appear here. Start a conversation to get going.</EmptyDescription>
      <EmptyAction><Button>New message</Button></EmptyAction>
    </Empty>
  );
