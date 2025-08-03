"use client";

import HowToDrawerContent from "@/app/components/rewards/HowToDrawerContent";
import { Button } from "@/app/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
} from "@/app/components/ui/drawer";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import { useHowToEarn } from "@/app/hooks/useHowToEarn";
import { Check } from "lucide-react";
import { useState } from "react";

export default function HowToDrawer({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  trigger = true,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: boolean;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { selectedSponsor } = useSponsor();
  const { frameContext } = useUser();

  // Use external control if provided, otherwise use internal state
  const openHowToEarn = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpenHowToEarn = externalOnOpenChange || setInternalOpen;

  const sponsorConfig = useHowToEarn(selectedSponsor!);

  const allConditionsMet = sponsorConfig?.steps
    .filter((step) => step.required)
    .every((step) => step.condition);

  return (
    <Drawer open={openHowToEarn} onOpenChange={setOpenHowToEarn}>
      {trigger && frameContext && (
        <DrawerTrigger asChild>
          <Button
            size="lg"
            className="button-style h-6 w-1/2 cursor-pointer text-xs sm:w-36"
          >
            {allConditionsMet ? (
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-500" />
                <span className="hidden sm:block">Eligible to Earn</span>
                <span className="block sm:hidden">Eligible</span>
              </div>
            ) : (
              "Start Earning"
            )}
          </Button>
        </DrawerTrigger>
      )}

      <HowToDrawerContent />
    </Drawer>
  );
}