"use client";

import {
  BoldIcon,
  ItalicIcon,
  MicIcon,
  MicOffIcon,
  StarIcon,
  UnderlineIcon,
} from "lucide-react";
import { useState } from "react";

import { Toggle } from "@/components/ui/toggle";

export function ToggleDemo() {
  const [muted, setMuted] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Default — text */}
      <div className="flex flex-wrap gap-2">
        <Toggle>Bold</Toggle>
        <Toggle defaultPressed>Pressed</Toggle>
        <Toggle disabled>Disabled</Toggle>
      </div>

      {/* With icon */}
      <div className="flex flex-wrap gap-2">
        <Toggle aria-label="Bold">
          <BoldIcon />
        </Toggle>
        <Toggle aria-label="Italic" defaultPressed>
          <ItalicIcon />
        </Toggle>
        <Toggle aria-label="Underline">
          <UnderlineIcon />
        </Toggle>
      </div>

      {/* Outline variant */}
      <div className="flex flex-wrap gap-2">
        <Toggle variant="outline" aria-label="Bold">
          <BoldIcon />
          Bold
        </Toggle>
        <Toggle variant="outline" aria-label="Italic" defaultPressed>
          <ItalicIcon />
          Italic
        </Toggle>
        <Toggle variant="outline" aria-label="Underline">
          <UnderlineIcon />
          Underline
        </Toggle>
      </div>

      {/* Sizes */}
      <div className="flex flex-wrap items-center gap-2">
        <Toggle size="sm" aria-label="Favourite">
          <StarIcon />
        </Toggle>
        <Toggle size="default" aria-label="Favourite">
          <StarIcon />
        </Toggle>
        <Toggle size="lg" aria-label="Favourite">
          <StarIcon />
        </Toggle>
      </div>

      {/* Controlled — mute toggle */}
      <div className="flex items-center gap-3">
        <Toggle
          pressed={muted}
          onPressedChange={setMuted}
          variant="outline"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <MicOffIcon /> : <MicIcon />}
          {muted ? "Unmuted" : "Mute"}
        </Toggle>
        <span className="text-muted-foreground text-sm">
          Microphone is {muted ? "muted" : "active"}
        </span>
      </div>
    </div>
  );
}
