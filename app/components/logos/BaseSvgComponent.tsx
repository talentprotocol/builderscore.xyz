import { BaseSvgProps } from "@/app/types/svg";

export default function BaseSvgComponent({
  className = "",
  viewBox,
  preserveAspectRatio = "xMidYMid meet",
  children,
}: BaseSvgProps & { preserveAspectRatio?: string }) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {children}
    </svg>
  );
}
