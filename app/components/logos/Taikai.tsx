import BaseSvgComponent from "@/app/components/logos/BaseSvgComponent";
import { LogoProps } from "@/app/types/svg";

export default function Taikai({
  className,
  color,
  preserveAspectRatio = "xMidYMid meet",
}: LogoProps) {
  return (
    <BaseSvgComponent
      className={className}
      viewBox="0 0 455 500"
      preserveAspectRatio={preserveAspectRatio}
    >
      <path
        d="M0.245975 459.537L0 460.065V500H55.5625L208.167 155.677L208.659 154.569L171.119 73.9594L0.245975 459.537Z"
        fill={color}
      />
      <path
        d="M204.141 0L189.793 32.1945L305.385 292.055H379.463L249.558 0.0175561L204.141 0Z"
        fill={color}
      />
      <path
        d="M320.717 326.361L369.95 436.895H121.535L94.0176 500H455V461.472L394.865 326.361H320.717Z"
        fill={color}
      />
    </BaseSvgComponent>
  );
}
