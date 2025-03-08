import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2 ml-1">
        <Image
          src="/talent_protocol_icon_white.svg"
          alt="Talent Protocol"
          width={7}
          height={7}
        />
        <h1 className="font-semibold">Builder Rewards</h1>
      </div>

      <Select defaultValue="0">
        <SelectTrigger className="bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white text-xs h-6 w-32 p-2 cursor-pointer">
          <SelectValue className="text-white" placeholder="Global" />
        </SelectTrigger>
        <SelectContent className="text-white border-none bg-neutral-800 text-xs">
          <SelectItem
            className="text-xs bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
            value="0"
          >
            Global
          </SelectItem>
          <SelectItem
            className="text-xs bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
            value="1"
          >
            Talent Protocol
          </SelectItem>
          <SelectItem
            className="text-xs bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
            value="2"
          >
            Base
          </SelectItem>
        </SelectContent>
      </Select>
    </nav>
  );
}