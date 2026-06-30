"use client";

import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  StretchHorizontalIcon,
  UnderlineIcon,
} from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ToggleGroupDemo() {
  return (
    <div className="flex flex-col gap-6">
      {/* Single selection — text alignment */}
      <ToggleGroup type="single" defaultValue="left">
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="justify" aria-label="Justify">
          <AlignJustifyIcon />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Multiple selection — text formatting */}
      <ToggleGroup type="multiple" defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Outline variant */}
      <ToggleGroup type="single" variant="outline" defaultValue="md">
        <ToggleGroupItem value="sm">S</ToggleGroupItem>
        <ToggleGroupItem value="md">M</ToggleGroupItem>
        <ToggleGroupItem value="lg">L</ToggleGroupItem>
        <ToggleGroupItem value="xl">XL</ToggleGroupItem>
      </ToggleGroup>

      {/* Small size */}
      <ToggleGroup type="single" size="sm" defaultValue="horizontal">
        <ToggleGroupItem value="horizontal" aria-label="Horizontal">
          <StretchHorizontalIcon />
          Horizontal
        </ToggleGroupItem>
        <ToggleGroupItem value="vertical" aria-label="Vertical">
          <StretchHorizontalIcon className="rotate-90" />
          Vertical
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Disabled */}
      <ToggleGroup type="single" defaultValue="a" disabled>
        <ToggleGroupItem value="a">Option A</ToggleGroupItem>
        <ToggleGroupItem value="b">Option B</ToggleGroupItem>
        <ToggleGroupItem value="c">Option C</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
