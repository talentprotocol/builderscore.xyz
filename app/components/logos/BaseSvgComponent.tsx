import { BaseSvgProps } from "@/app/types/svg";

export default function BaseSvgComponent({
  height = 24,
  width = "",
  className = "",
  viewBox,
  preserveAspectRatio = "xMidYMid meet",
  children,
}: BaseSvgProps & { preserveAspectRatio?: string }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        // Ensure the SVG maintains aspect ratio based on height
        width: width,
        height: height,
        // Prevent scaling issues in different browsers
        flexShrink: 0,
      }}
    >
      {children}
    </svg>
  );
}
