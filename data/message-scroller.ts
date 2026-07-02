export const MESSAGES = [
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
  {
    align: "end" as const,
    id: "3",
    text: "Does it handle large transcripts efficiently?",
  },
  {
    align: "start" as const,
    id: "4",
    text: "Yes — it uses content-visibility: auto and contain-intrinsic-size to virtualise off-screen items without a library.",
  },
  {
    align: "end" as const,
    id: "5",
    text: "That's clever. What about scroll anchoring?",
  },
  {
    align: "start" as const,
    id: "6",
    text: "Each turn boundary can be marked with scrollAnchor on MessageScrollerItem. On load, it can jump to the last anchor to restore context.",
  },
  {
    align: "end" as const,
    id: "7",
    text: "Perfect, this is exactly what I needed.",
  },
  {
    align: "start" as const,
    id: "8",
    text: "Happy to help! Let me know if you need more details.",
  },
];
