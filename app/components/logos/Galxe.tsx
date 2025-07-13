import BaseSvgComponent from "@/app/components/logos/BaseSvgComponent";
import { LogoProps } from "@/app/types/svg";

export default function Galxe({
  className,
  color,
  preserveAspectRatio = "xMidYMid meet",
}: LogoProps) {
  return (
    <BaseSvgComponent
      className={className}
      viewBox="0 0 65 64"
      preserveAspectRatio={preserveAspectRatio}
    >
      <g clipPath="url(#clip0_4436_14069)">
        <path
          d="M44.8667 16.842L4.79838 39.9523L42.0244 12.5073C43.2722 11.588 45.0426 11.9573 45.8163 13.2981C46.533 14.5396 46.1078 16.1261 44.8651 16.8436L44.8667 16.842ZM50.592 36.8427C50.0544 35.9121 48.8638 35.5947 47.9321 36.1317L21.4056 51.43L49.657 39.6088C50.7385 39.1565 51.1767 37.8581 50.5903 36.8427H50.592ZM63.9758 16.3343C62.8535 14.3932 60.3273 13.7928 58.4509 15.0212L0.5 52.9449L62.3518 21.7706C64.3552 20.7602 65.0979 18.2755 63.9758 16.3343Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_4436_14069">
          <rect
            width="64"
            height="64"
            fill={color}
            transform="translate(0.25)"
          />
        </clipPath>
      </defs>
    </BaseSvgComponent>
  );
}
