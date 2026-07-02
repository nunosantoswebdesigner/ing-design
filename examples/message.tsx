import { BotIcon, CopyIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from "@/components/ui/message";

export const MessageDemo = () => (
    <div className="flex flex-col gap-4">
      <Marker variant="separator"><MarkerContent>Today</MarkerContent></Marker>
      {/* User message */}
      <Message align="end">
        <MessageContent>
          <Bubble variant="default" align="end"><BubbleContent>Can you explain how the ING Design component system works?</BubbleContent></Bubble>
          <MessageFooter>Delivered · 14:30</MessageFooter>
        </MessageContent>
      </Message>
      {/* Assistant message group */}
      <MessageGroup>
        <Message align="start">
          <MessageAvatar><div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><BotIcon className="size-4" /></div></MessageAvatar>
          <MessageContent>
            <MessageHeader>Assistant · 14:31</MessageHeader>
            <Bubble variant="secondary"><BubbleContent>ING Design is a shadcn-based registry. Each component lives in{" "}<code>registry/new-york/</code> and can be installed via the CLI.</BubbleContent></Bubble>
            <Bubble variant="secondary"><BubbleContent>It supports multiple themes — new-york, force8, myswissski, and myicehockey — each with its own token overrides.</BubbleContent></Bubble>
            <MessageFooter>
              <Button variant="ghost" size="icon-xs" aria-label="Copy"><CopyIcon /></Button>
              <Button variant="ghost" size="icon-xs" aria-label="Helpful"><ThumbsUpIcon /></Button>
              <Button variant="ghost" size="icon-xs" aria-label="Not helpful"><ThumbsDownIcon /></Button>
            </MessageFooter>
          </MessageContent>
        </Message>
      </MessageGroup>
      {/* AI reasoning marker */}
      <Marker><MarkerContent className="shimmer">Thinking…</MarkerContent></Marker>
    </div>
  );
