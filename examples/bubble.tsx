import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";

export function BubbleDemo() {
  return (
    <div className="flex flex-col gap-6 px-2">
      {/* Conversation thread */}
      <div className="flex flex-col gap-4">
        <Bubble variant="secondary">
          <BubbleContent>Hey, are you free for a call tomorrow?</BubbleContent>
        </Bubble>

        <Bubble variant="default" align="end">
          <BubbleContent>Sure! What time works for you?</BubbleContent>
        </Bubble>

        <Bubble variant="secondary">
          <BubbleContent>How about 2pm? I can send a calendar invite.</BubbleContent>
          <BubbleReactions side="bottom" align="start">
            👍 2
          </BubbleReactions>
        </Bubble>

        <Bubble variant="default" align="end">
          <BubbleContent>2pm works perfectly. See you then!</BubbleContent>
        </Bubble>
      </div>

      {/* All variants */}
      <div className="flex flex-col gap-2">
        {(["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"] as const).map((v) => (
          <Bubble key={v} variant={v}>
            <BubbleContent className="capitalize">{v} variant</BubbleContent>
          </Bubble>
        ))}
      </div>

      {/* BubbleGroup */}
      <BubbleGroup>
        <Bubble variant="secondary">
          <BubbleContent>First message in group</BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>Second message in group</BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>Third message in group</BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  );
}
