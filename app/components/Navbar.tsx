import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2 ml-1">
        <Image
          src="/talent_protocol_icon_white.svg"
          alt="Talent Protocol"
          width={6}
          height={6}
        />
        <h1 className="font-semibold">Builder Rewards</h1>
      </div>
    </nav>
  );
}