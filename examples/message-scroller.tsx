import { BotIcon } from "lucide-react";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { MESSAGES } from "@/data/message-scroller";

export const MessageScrollerDemo = () => (
    <MessageScrollerProvider>
      <MessageScroller className="h-72 rounded-lg border">
        <MessageScrollerViewport>
          <MessageScrollerContent className="p-4">
            <Marker variant="separator"><MarkerContent>Today</MarkerContent></Marker>
            {MESSAGES.map((msg) => (
              <MessageScrollerItem key={msg.id} messageId={msg.id} scrollAnchor={msg.id === "8"}>
                <Message align={msg.align}>
                  {msg.align === "start" && (
                    <MessageAvatar><div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><BotIcon className="size-4" /></div></MessageAvatar>
                  )}
                  <MessageContent>
                    <Bubble
                      variant={msg.align === "end" ? "default" : "secondary"}
                      align={msg.align}
                    >
                      <BubbleContent>{msg.text}</BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
