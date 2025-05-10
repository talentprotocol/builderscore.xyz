"use client";

import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import type { TalentProfileSearchApi } from "@/app/types/talent";

interface ViewProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: TalentProfileSearchApi | null;
}

export function ViewProfileSheet({
  open,
  onOpenChange,
  profile,
}: ViewProfileSheetProps) {
  if (!profile) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Profile Details</SheetTitle>
          <SheetDescription>
            View details for {profile.name || profile.display_name}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Name</h3>
            <p className="text-sm">{profile.name}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Display Name</h3>
            <p className="text-sm">{profile.display_name}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Location</h3>
            <p className="text-sm">{profile.location || "Not specified"}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Builder Score</h3>
            <p className="text-sm">{profile.builder_score?.points ?? "N/A"}</p>
          </div>
          {profile.tags && profile.tags.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {profile.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-muted inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <SheetFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
