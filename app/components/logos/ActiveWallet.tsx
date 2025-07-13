import BaseSvgComponent from "@/app/components/logos/BaseSvgComponent";
import { LogoProps } from "@/app/types/svg";

export default function ActiveWallet({
  className,
  color,
  preserveAspectRatio = "xMidYMid meet",
}: LogoProps) {
  return (
    <BaseSvgComponent
      className={className}
      viewBox="0 0 13 20"
      preserveAspectRatio={preserveAspectRatio}
    >
      <path
        d="M6.36713 13.8145L12.5062 10.1863L6.36713 0L0.228088 10.1863L6.36713 13.8145Z"
        fill={color}
      />
      <path
        d="M6.36713 20.0014L12.5095 11.3516L6.36713 14.9765L0.228088 11.3516L6.36713 20.0014Z"
        fill={color}
      />
    </BaseSvgComponent>
  );
}
