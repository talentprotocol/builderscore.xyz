import Link from "next/link";
import HowToDrawer from "@/app/components/HowToDrawer";
import { Button } from "@/app/components/ui/button";

export default function RewardsActions() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-3 w-full">
      <Link
        href="https://app.talentprotocol.com"
        target="_blank"
        className="w-full"
      >
        <Button
          size="lg"
          className="bg-white hover:bg-neutral-100 border border-neutral-200 cursor-pointer w-full text-black"
        >
          Improve Talent Profile
        </Button>
      </Link>

      <HowToDrawer />
    </div>
  );
}
