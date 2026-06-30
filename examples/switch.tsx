"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SwitchDemo() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      {/* Basic */}
      <div className="flex items-center gap-2">
        <Switch id="sw-basic" defaultChecked sounds />
        <Label htmlFor="sw-basic">Airplane mode</Label>
      </div>

      {/* Controlled with status */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="sw-notifications" className="text-sm font-medium">
            Push notifications
          </Label>
          <span className="text-muted-foreground text-xs">
            {notifications ? "Enabled" : "Disabled"}
          </span>
        </div>
        <Switch
          id="sw-notifications"
          checked={notifications}
          onCheckedChange={setNotifications}
          sounds
        />
      </div>

      {/* Group */}
      <div className="flex flex-col gap-3 rounded-lg border p-4">
        {[
          { id: "sw-email", label: "Email digest", defaultChecked: true },
          { id: "sw-sms", label: "SMS alerts", defaultChecked: false },
          { id: "sw-slack", label: "Slack messages", defaultChecked: true },
        ].map(({ id, label, defaultChecked }) => (
          <div key={id} className="flex items-center justify-between">
            <Label htmlFor={id}>{label}</Label>
            <Switch id={id} defaultChecked={defaultChecked} sounds />
          </div>
        ))}
      </div>

      {/* Disabled states */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch id="sw-dis-off" disabled />
          <Label htmlFor="sw-dis-off" className="text-muted-foreground">
            Off (disabled)
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="sw-dis-on" disabled defaultChecked />
          <Label htmlFor="sw-dis-on" className="text-muted-foreground">
            On (disabled)
          </Label>
        </div>
      </div>
    </div>
  );
}
