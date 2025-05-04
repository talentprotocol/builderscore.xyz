import { BaseSvgProps } from "@/app/types/svg";

export default function BaseSvgComponent({
  height = 24,
  width = "",
  className = "",
  viewBox,
  children,
}: BaseSvgProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {children}
    </svg>
  );
}
