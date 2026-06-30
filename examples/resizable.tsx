"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export function ResizableDemo() {
  return (
    <div className="flex flex-col gap-6">
      {/* Horizontal */}
      <ResizablePanelGroup orientation="horizontal" className="min-h-40 rounded-lg border">
        <ResizablePanel defaultSize={30}>
          <div className="flex h-full items-center justify-center p-4">
            <span className="text-muted-foreground text-sm">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <div className="flex h-full items-center justify-center p-4">
            <span className="text-muted-foreground text-sm">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Three panels */}
      <ResizablePanelGroup orientation="horizontal" className="min-h-40 rounded-lg border">
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="flex h-full items-center justify-center p-4">
            <span className="text-muted-foreground text-sm">Nav</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55}>
          <div className="flex h-full items-center justify-center p-4">
            <span className="text-muted-foreground text-sm">Editor</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="flex h-full items-center justify-center p-4">
            <span className="text-muted-foreground text-sm">Preview</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Vertical */}
      <ResizablePanelGroup orientation="vertical" className="min-h-56 rounded-lg border">
        <ResizablePanel defaultSize={60}>
          <div className="flex h-full items-center justify-center p-4">
            <span className="text-muted-foreground text-sm">Top panel</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <div className="flex h-full items-center justify-center p-4">
            <span className="text-muted-foreground text-sm">Bottom panel</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
