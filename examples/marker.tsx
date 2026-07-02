import { BotIcon, CheckCircle2Icon, ClockIcon } from "lucide-react";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";

export const MarkerDemo = () => (
    <div className="flex flex-col gap-4">
      {/* Default */}
      <Marker>
        <MarkerIcon><ClockIcon /></MarkerIcon>
        <MarkerContent>Today at 14:32</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon><BotIcon /></MarkerIcon>
        <MarkerContent>Assistant started thinking…</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon><CheckCircle2Icon /></MarkerIcon>
        <MarkerContent>Task completed successfully</MarkerContent>
      </Marker>
      {/* Separator */}
      <Marker variant="separator"><MarkerContent>Yesterday</MarkerContent></Marker>
      <Marker variant="separator"><MarkerContent>New messages</MarkerContent></Marker>
      {/* Border */}
      <Marker variant="border">
        <MarkerIcon><BotIcon /></MarkerIcon>
        <MarkerContent>Model switched to GPT-4o</MarkerContent>
      </Marker>
      <Marker variant="border"><MarkerContent>Conversation resumed</MarkerContent></Marker>
    </div>
  );
