import BaseSvgComponent from "@/app/components/logos/BaseSvgComponent";
import { LogoProps } from "@/app/types/svg";

export default function BinanceAccountBound({
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
      <g clipPath="url(#clip0_4436_14059)">
        <path
          d="M20.3273 26.892L32.7573 14.4671L45.1923 26.9021L52.4208 19.6686L32.7573 0L13.0938 19.6635L20.3273 26.892Z"
          fill={color}
        />
        <path
          d="M0.75 32.0025L7.9785 24.7689L15.212 32.0025L7.9785 39.231L0.75 32.0025Z"
          fill={color}
        />
        <path
          d="M20.3273 37.108L32.7573 49.5379L45.1923 37.1029L52.4259 44.3263L32.7623 63.9949L13.0938 44.3415L20.3273 37.108Z"
          fill={color}
        />
        <path
          d="M50.2881 32.0025L57.5166 24.7689L64.7501 31.9974L57.5166 39.236L50.2881 32.0025Z"
          fill={color}
        />
        <path
          d="M40.0922 31.9974L32.7575 24.6577L27.3336 30.0816L26.7068 30.7034L25.4229 31.9873L32.7575 39.3169L40.0922 32.0025V31.9974Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_4436_14059">
          <rect
            width="64"
            height="64"
            fill={color}
            transform="translate(0.75)"
          />
        </clipPath>
      </defs>
    </BaseSvgComponent>
  );
}
