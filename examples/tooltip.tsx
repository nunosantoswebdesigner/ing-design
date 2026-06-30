import { InfoIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function TooltipDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {/* Basic */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Helpful hint</TooltipContent>
      </Tooltip>

      {/* Icon button with tooltip */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <SettingsIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>

      {/* With keyboard shortcut */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="New item">
            <PlusIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-2">
          New item
          <Kbd>⌘K</Kbd>
        </TooltipContent>
      </Tooltip>

      {/* Sides */}
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="capitalize">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
        </Tooltip>
      ))}

      {/* On a non-interactive element via span */}
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-default items-center gap-1 text-sm underline decoration-dotted">
            <InfoIcon className="size-3.5" />
            What is this?
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-48">
          Tooltips provide short contextual information about an element on hover or focus.
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
