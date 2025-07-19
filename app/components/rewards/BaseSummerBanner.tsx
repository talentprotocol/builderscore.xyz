import BaseSummerIcon from "@/app/components/logos/BaseSummerIcon";
import BaseSummerLogo from "@/app/components/logos/BaseSummerLogo";
import Image from "next/image";

export function BaseSummerBanner() {
  return (
    <div className="border-style relative mt-2 mb-2 flex justify-center overflow-hidden rounded-lg">
      <div className="flex h-28 w-full justify-center border-b-8 border-[#FCCF10] bg-[#FDFBF0] bg-cover bg-center p-2">
        <Image
          src="/images/rewards/base-summer/banner-texture.png"
          alt="Base Summer Banner"
          height={112}
          width={500}
          className="absolute top-0 left-0 z-10 h-full w-full object-cover"
        />

        <div className="flex h-full w-full items-center justify-between gap-4">
          <BaseSummerIcon
            className="z-20 mt-1 h-[95%] w-auto"
            color="#0052FF"
            altcolor="#FCCF10"
          />
          <BaseSummerLogo
            className="z-20 mt-1 h-[80%] w-auto"
            color="#0052FF"
          />
        </div>
      </div>
    </div>
  );
}
