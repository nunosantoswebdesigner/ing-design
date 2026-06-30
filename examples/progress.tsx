"use client";

import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";

export function ProgressDemo() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setValue(68), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {/* Animated on mount */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Uploading…</span>
          <span className="font-medium">{value}%</span>
        </div>
        <Progress value={value} />
      </div>

      {/* Fixed values */}
      <div className="flex flex-col gap-3">
        <Progress value={0} />
        <Progress value={25} />
        <Progress value={50} />
        <Progress value={75} />
        <Progress value={100} />
      </div>

      {/* Thick */}
      <Progress value={42} className="h-3" />
    </div>
  );
}
