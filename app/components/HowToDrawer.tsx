"use client";

import { Button } from "@/app/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/drawer";
import { useState } from "react";

const EARNING_STEPS = [
  "Connect your GitHub account and crypto wallets to start earning rewards.",
  "Achieve a Builder Score above 40 and get verified as a human.",
  "Deploy and ship software directly on-chain to earn points.",
  "Get paid in USDC on Base network every Monday based on your contributions.",
];

export default function HowToDrawer() {
  const [openHowToEarn, setOpenHowToEarn] = useState(false);

  return (
    <Drawer open={openHowToEarn} onOpenChange={setOpenHowToEarn}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-300 cursor-pointer"
        >
          How to Earn
        </Button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerContent className="bg-neutral-900">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-white">How to Earn</DrawerTitle>
          </DrawerHeader>

          <div className="p-4 pt-2">
            <ul className="list-none space-y-6 text-sm">
              {EARNING_STEPS.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="shrink-0 flex items-center justify-center w-5 h-5 bg-neutral-700 rounded-full text-xs font-medium">
                    {index + 1}
                  </div>
                  <p>{step}</p>
                </li>
              ))}
            </ul>
          </div>

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button
                size="lg"
                className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 cursor-pointer"
              >
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
