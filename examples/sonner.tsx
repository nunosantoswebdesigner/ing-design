"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export const SonnerDemo = () => (
    <div className="flex flex-col gap-4">
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast("File saved successfully.")}>Default</Button>
        <Button variant="outline" onClick={() => toast.success("Changes saved.")}>Success</Button>
        <Button variant="outline" onClick={() => toast.error("Something went wrong.")}>Error</Button>
        <Button variant="outline" onClick={() => toast.warning("Disk space is low.")}>Warning</Button>
        <Button variant="outline" onClick={() => toast.info("A new version is available.")}>Info</Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.loading("Uploading…", {
              duration: 3000,
            })
          }
        >Loading</Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("File deleted.", {
              action: { label: "Undo", onClick: () => toast.success("Restored.") },
              description: "report.pdf was moved to trash.",
            })
          }
        >With action</Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Profile updated.", {
              description: "Your changes have been saved to the server.",
            })
          }
        >With description</Button>
      </div>
    </div>
  );
