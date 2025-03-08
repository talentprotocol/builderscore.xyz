import { Button } from "@/app/components/ui/button";
import HowToDrawer from "@/app/components/HowToDrawer";

export default function RewardsActions() {
  return (
    <div className="grid grid-cols-3 gap-4 mt-3">
      <Button
        size="lg"
        className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-300"
      >
        Sync Data
      </Button>

      <Button
        size="lg"
        className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-300 cursor-pointer"
      >
        Connect GitHub
      </Button>

      <HowToDrawer />
    </div>
  );
}
