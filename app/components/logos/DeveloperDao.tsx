import BaseSvgComponent from "@/app/components/logos/BaseSvgComponent";
import { LogoProps } from "@/app/types/svg";

export default function DeveloperDao({
  className,
  color,
  altcolor,
  preserveAspectRatio = "xMidYMid meet",
}: LogoProps) {
  return (
    <BaseSvgComponent
      className={className}
      viewBox="0 0 70 70"
      preserveAspectRatio={preserveAspectRatio}
    >
      <circle cx="35" cy="35" r="35" fill={color}></circle>
      <path
        fill={altcolor || "white"}
        d="M21.473 43.025h-8.26V26.701h8.26c5.385 0 8.796 2.997 8.796 8.162 0 5.166-3.411 8.162-8.796 8.162m0-12.206h-3.679v8.089h3.68c2.899 0 3.898-.366 3.898-4.045s-1-4.044-3.899-4.044m18.292 15.447h-8.771v-3.24h8.77zm9.5-3.24h-8.26V26.7h8.26c5.384 0 8.795 2.997 8.795 8.162 0 5.166-3.411 8.162-8.796 8.162m0-12.207h-3.68v8.089h3.68c2.899 0 3.898-.366 3.898-4.045s-1-4.044-3.899-4.044"
      ></path>
    </BaseSvgComponent>
  );
}
