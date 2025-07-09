import BaseSvgComponent from "@/app/components/logos/BaseSvgComponent";
import { LogoProps } from "@/app/types/svg";

export default function StackScore({
  className,
  color,
  preserveAspectRatio = "xMidYMid meet",
}: LogoProps) {
  return (
    <BaseSvgComponent
      className={className}
      viewBox="0 0 144 144"
      preserveAspectRatio={preserveAspectRatio}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 0C10.7452 0 0 10.7452 0 24V120C0 133.255 10.7452 144 24 144H120C133.255 144 144 133.255 144 120V24C144 10.7452 133.255 0 120 0H24ZM75.1223 57.5982C73.1536 59.1126 72 61.4555 72 63.9392V119C72 121.761 74.2386 124 77 124H119C121.761 124 124 121.761 124 119V24.0617C124 22.4024 122.096 21.4648 120.781 22.4765L75.1223 57.5982Z"
        fill={color}
      />
    </BaseSvgComponent>
  );
}
