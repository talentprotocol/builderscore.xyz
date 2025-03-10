import { Button } from "@/app/components/ui/button";
import HowToDrawer from "@/app/components/HowToDrawer";

export default function RewardsActions() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-3">
      <Button
        size="lg"
        className="bg-white hover:bg-neutral-300 border border-neutral-200 text-black cursor-pointer"
      >
        View your Rewards
      </Button>

      <HowToDrawer />
    </div>
  );
}
