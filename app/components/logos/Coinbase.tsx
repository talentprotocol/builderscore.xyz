import BaseSvgComponent from "@/app/components/logos/BaseSvgComponent";
import { LogoProps } from "@/app/types/svg";

export default function Coinbase({
  className,
  color,
  preserveAspectRatio = "xMidYMid meet",
}: LogoProps) {
  return (
    <BaseSvgComponent
      className={className}
      viewBox="0 0 1527 1551"
      preserveAspectRatio={preserveAspectRatio}
    >
      <g id="clipPath" clipPath="url(#cp1)">
        <g id="Layer">
          <path
            id="Layer"
            fill={color}
            d="m350.4 777.1c0 259.8 176.7 453.3 428.7 453.3 182.5 0 327.4-115.5 379.5-283h365.1c-66.7 361-367.9 603.6-744.5 603.6-446 0-779.2-329.2-779.2-773.9 0-444.8 341.8-776.9 779.2-776.9 385.2 0 680.6 242.6 747.3 600.6h-367.9c-55-167.5-199.8-280.1-382.3-280.1-252 0-425.8 193.5-425.9 456.4z"
          />
        </g>
      </g>
    </BaseSvgComponent>
  );
}
