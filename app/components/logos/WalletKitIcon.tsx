import BaseSvgComponent from "@/app/components/logos/BaseSvgComponent";
import { LogoProps } from "@/app/types/svg";

export function WalletKitIcon({
  className,
  color,
  altcolor = "#202020",
  preserveAspectRatio = "xMidYMid meet",
}: LogoProps) {
  return (
    <BaseSvgComponent
      className={className}
      viewBox="0 0 256 256"
      preserveAspectRatio={preserveAspectRatio}
    >
      <path
        d="M0 72C0 32.2355 32.2355 0 72 0H184C223.764 0 256 32.2355 256 72V184C256 223.764 223.764 256 184 256H72C32.2355 256 0 223.764 0 184V72Z"
        fill={color}
      />
      <path
        d="M52 76C52 69.3726 57.3726 64 64 64H158C164.627 64 170 69.3726 170 76V100H52V76Z"
        fill={altcolor}
      />
      <path
        d="M52 102H198C201.314 102 204 104.686 204 108V180C204 186.627 198.627 192 192 192H64C57.3726 192 52 186.627 52 180V102Z"
        fill={altcolor}
      />
    </BaseSvgComponent>
  );
}
