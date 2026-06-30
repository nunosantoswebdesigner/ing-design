"use client";

import { BotIcon } from "lucide-react";

import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message";
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
  {
    align: "end" as const,
    id: "1",
    text: "Hello! Can you help me understand how MessageScroller works?",
  },
  {
    align: "start" as const,
    id: "2",
    text: "Of course! MessageScroller manages scroll position in streaming chat UIs — it auto-follows new content and shows a scroll button when you're reading history.",
  },
  { align: "end" as const, id: "3", text: "Does it handle large transcripts efficiently?" },
  {
    align: "start" as const,
    id: "4",
    text: "Yes — it uses content-visibility: auto and contain-intrinsic-size to virtualise off-screen items without a library.",
  },
  { align: "end" as const, id: "5", text: "That's clever. What about scroll anchoring?" },
  {
    align: "start" as const,
    id: "6",
    text: "Each turn boundary can be marked with scrollAnchor on MessageScrollerItem. On load, it can jump to the last anchor to restore context.",
  },
  { align: "end" as const, id: "7", text: "Perfect, this is exactly what I needed." },
  {
    align: "start" as const,
    id: "8",
    text: "Happy to help! Let me know if you need more details.",
  },
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
              <MessageScrollerItem key={msg.id} messageId={msg.id} scrollAnchor={msg.id === "8"}>
                <Message align={msg.align}>
                  {msg.align === "start" && (
                    <MessageAvatar>
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <BotIcon className="size-4" />
                      </div>
                    </MessageAvatar>
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
}
