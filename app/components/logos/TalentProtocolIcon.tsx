import BaseSvgComponent from "@/app/components/logos/BaseSvgComponent";
import { LogoProps } from "@/app/types/svg";

export default function TalentProtocolIcon({
  className,
  color,
  preserveAspectRatio = "xMidYMid meet",
}: LogoProps) {
  return (
    <BaseSvgComponent
      className={className}
      viewBox="0 0 103 216"
      preserveAspectRatio={preserveAspectRatio}
    >
      <path
        d="M11.1245 90.8628C15.4526 95.1782 21.2234 97.3359 28.4368 97.3359L102.213 97.3359L93.9037 73.6013H35.1694C30.6811 73.6013 28.4368 71.2038 28.4368 66.409L28.4368 8.01778L4.87281 0L4.8728 73.6013C4.8728 80.7936 6.95672 86.5474 11.1245 90.8628Z"
        fill={color}
      />
      <path
        d="M11.1245 209.527C15.4526 213.842 21.2234 216 28.4368 216H102.213L93.9037 192.265H35.1694C30.6811 192.265 28.4368 189.868 28.4368 185.073L28.4368 126.682L4.87281 118.664L4.8728 192.265C4.8728 199.458 6.95672 205.212 11.1245 209.527Z"
        fill={color}
      />
    </BaseSvgComponent>
  );
}
