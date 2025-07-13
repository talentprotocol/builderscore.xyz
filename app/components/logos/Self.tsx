import BaseSvgComponent from "@/app/components/logos/BaseSvgComponent";
import { LogoProps } from "@/app/types/svg";

export default function Self({
  className,
  color,
  preserveAspectRatio = "xMidYMid meet",
}: LogoProps) {
  return (
    <BaseSvgComponent
      className={className}
      viewBox="0 0 1024 1024"
      preserveAspectRatio={preserveAspectRatio}
    >
      <g clipPath="url(#clip1_4861_1150)">
        <path
          d="M512.093 433.961H512C468.927 433.961 434.01 468.676 434.01 511.5V511.593C434.01 554.416 468.927 589.131 512 589.131H512.093C555.166 589.131 590.083 554.416 590.083 511.593V511.5C590.083 468.676 555.166 433.961 512.093 433.961Z"
          fill={color}
        />
        <path
          d="M359.002 439.705C359.002 393.663 396.552 356.33 442.862 356.33H604.805L784.173 178H337.012L176.559 337.524V599.97H359.002V439.612V439.705Z"
          fill={color}
        />
        <path
          d="M664.998 422.381V577.181C664.998 623.222 627.448 660.556 581.138 660.556H425.437L239.827 845.093H686.988L847.441 685.568V422.474H664.998V422.381Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip1_4861_1150">
          <rect width="1024" height="1024" fill="none" />
        </clipPath>
      </defs>
    </BaseSvgComponent>
  );
}
