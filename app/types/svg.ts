import { ReactNode } from "react";

export interface BaseSvgProps {
  height?: number | string;
  width?: number | string;
  className?: string;
  color?: string;
  viewBox: string;
  children: ReactNode;
}

export type LogoProps = Omit<BaseSvgProps, "viewBox" | "children">;
