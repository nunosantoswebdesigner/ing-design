"use client";

import { useState } from "react";

import { Slider } from "@/components/ui/slider";

export function SliderDemo() {
  const [single, setSingle] = useState([40]);
  const [range, setRange] = useState([20, 70]);
  const [stepped, setStepped] = useState([50]);

  return (
    <div className="flex flex-col gap-8 px-2">
      {/* Default */}
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>Volume</span>
          <span>{single[0]}%</span>
        </div>
        <Slider value={single} onValueChange={setSingle} min={0} max={100} sounds />
      </div>

      {/* Range */}
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>Price range</span>
          <span>
            ${range[0]} – ${range[1]}
          </span>
        </div>
        <Slider value={range} onValueChange={setRange} min={0} max={100} sounds />
      </div>

      {/* Stepped */}
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>Step (25)</span>
          <span>{stepped[0]}</span>
        </div>
        <Slider value={stepped} onValueChange={setStepped} min={0} max={100} step={25} sounds />
      </div>

      {/* Disabled */}
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">Disabled</span>
        <Slider defaultValue={[60]} disabled />
      </div>

      {/* Vertical */}
      <div className="flex items-end gap-6">
        {[30, 60, 80].map((v, i) => (
          <Slider key={i} defaultValue={[v]} orientation="vertical" className="h-28" />
        ))}
      </div>
    </div>
  );
}
