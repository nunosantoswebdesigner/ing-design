"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SIDES = ["top", "right", "bottom", "left"] as const;

export function SheetDemo() {
  return (
    <div className="flex flex-col gap-6">
      {/* Side variants */}
      <div className="flex flex-wrap gap-2">
        {SIDES.map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button variant="outline" className="capitalize">
                {side}
              </Button>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Sheet — {side}</SheetTitle>
                <SheetDescription>
                  Slides in from the {side}. Click outside or press Esc to
                  close.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        ))}
      </div>

      {/* With form */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Edit profile</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when done.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sheet-name">Name</Label>
              <Input id="sheet-name" defaultValue="Nuno Santos" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sheet-username">Username</Label>
              <Input id="sheet-username" defaultValue="@nunosantos" />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button>Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
