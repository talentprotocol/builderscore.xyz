import BaseSvgComponent from "@/app/components/logos/BaseSvgComponent";
import { LogoProps } from "@/app/types/svg";

export default function JumperPass({
  className,
  color,
  preserveAspectRatio = "xMidYMid meet",
}: LogoProps) {
  return (
    <BaseSvgComponent
      className={className}
      viewBox="0 0 64 64"
      preserveAspectRatio={preserveAspectRatio}
    >
      <path
        d="M34.2816 31.9991L11.6543 54.6262L17.311 60.283C20.1394 63.1114 25.7961 63.1115 28.6245 60.2831L51.2517 37.6559C54.0801 34.8275 54.0803 29.1705 51.2517 26.3424L39.9385 15.0286L28.6249 26.3423L34.2816 31.9991Z"
        fill={color}
      />
      <path
        opacity="0.75"
        d="M11.6548 9.37201L17.3116 3.71521C20.14 0.886818 25.7968 0.886818 28.6252 3.71521L34.282 9.37201L22.9684 20.6856L11.6548 9.37201Z"
        fill={color}
      />
    </BaseSvgComponent>
  );
}
