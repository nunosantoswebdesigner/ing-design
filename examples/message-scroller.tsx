"use client";

import { BotIcon } from "lucide-react";

import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Marker, MarkerContent } from "@/components/ui/marker";

const MESSAGES = [
  { id: "1", align: "end" as const, text: "Hello! Can you help me understand how MessageScroller works?" },
  { id: "2", align: "start" as const, text: "Of course! MessageScroller manages scroll position in streaming chat UIs — it auto-follows new content and shows a scroll button when you're reading history." },
  { id: "3", align: "end" as const, text: "Does it handle large transcripts efficiently?" },
  { id: "4", align: "start" as const, text: "Yes — it uses content-visibility: auto and contain-intrinsic-size to virtualise off-screen items without a library." },
  { id: "5", align: "end" as const, text: "That's clever. What about scroll anchoring?" },
  { id: "6", align: "start" as const, text: "Each turn boundary can be marked with scrollAnchor on MessageScrollerItem. On load, it can jump to the last anchor to restore context." },
  { id: "7", align: "end" as const, text: "Perfect, this is exactly what I needed." },
  { id: "8", align: "start" as const, text: "Happy to help! Let me know if you need more details." },
];

export function MessageScrollerDemo() {
  return (
    <MessageScrollerProvider>
      <MessageScroller className="h-72 rounded-lg border">
        <MessageScrollerViewport>
          <MessageScrollerContent className="p-4">
            <Marker variant="separator">
              <MarkerContent>Today</MarkerContent>
            </Marker>
            {MESSAGES.map((msg) => (
              <MessageScrollerItem
                key={msg.id}
                messageId={msg.id}
                scrollAnchor={msg.id === "8"}
              >
                <Message align={msg.align}>
                  {msg.align === "start" && (
                    <MessageAvatar>
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <BotIcon className="size-4" />
                      </div>
                    </MessageAvatar>
                  )}
                  <MessageContent>
                    <Bubble variant={msg.align === "end" ? "default" : "secondary"} align={msg.align}>
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
}
