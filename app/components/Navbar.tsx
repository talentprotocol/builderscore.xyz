import Image from "next/image";
import SelectSponsor from "@/app/components/SelectSponsor";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2 ml-1">
        <Image
          src="images/talent_protocol_icon_white.svg"
          alt="Talent Protocol"
          width={7}
          height={7}
        />
        <h1 className="font-semibold">Builder Rewards</h1>
      </div>
      <SelectSponsor />
    </nav>
  );
}