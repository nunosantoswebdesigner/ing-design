import { ArrowUp, Command } from "lucide-react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

export const KbdDemo = () => (
    <div className="flex flex-col items-start gap-4">
      {/* Single keys */}
      <div className="flex flex-wrap items-center gap-2">
        <Kbd>⌘</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>⌃</Kbd>
        <Kbd>↵</Kbd>
        <Kbd>⌫</Kbd>
        <Kbd>Tab</Kbd>
        <Kbd>Esc</Kbd>
      </div>
      {/* Key combos */}
      <div className="flex flex-wrap items-center gap-3">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>⌃</Kbd>
          <Kbd>⌥</Kbd>
          <Kbd>Del</Kbd>
        </KbdGroup>
      </div>
      {/* With icon */}
      <div className="flex items-center gap-2">
        <KbdGroup>
          <Kbd><Command /></Kbd>
          <Kbd><ArrowUp /></Kbd>
        </KbdGroup>
      </div>
      {/* Inline in text */}
      <p className="text-sm text-muted-foreground">
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command menu, or <Kbd>Esc</Kbd> to close it.
      </p>
    </div>
  );
