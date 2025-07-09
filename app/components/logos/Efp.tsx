import BaseSvgComponent from "@/app/components/logos/BaseSvgComponent";
import { LogoProps } from "@/app/types/svg";

export default function Efp({
  className,
  color,
  preserveAspectRatio = "xMidYMid meet",
}: LogoProps) {
  return (
    <BaseSvgComponent
      className={className}
      viewBox="150 100 270 350"
      preserveAspectRatio={preserveAspectRatio}
    >
      <path
        d="M167.68 258.56L255.36 112.64L342.4 258.56L255.36 311.68L167.68 258.56Z"
        fill={color}
      />
      <path
        d="M255.36 327.68L167.68 274.56L255.36 398.08L342.4 274.56L255.36 327.68Z"
        fill={color}
      />
      <path
        d="M367.36 341.76H342.4V378.88H307.84V401.92H342.4V440.32H367.36V401.92H401.28V378.88H367.36V341.76Z"
        fill={color}
      />
    </BaseSvgComponent>
  );
}
