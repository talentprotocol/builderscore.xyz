import { ReactNode } from "react";

export interface BaseSvgProps {
  className?: string;
  color?: string;
  altcolor?: string;
  viewBox: string;
  preserveAspectRatio?: string;
  children: ReactNode;
}

export type LogoProps = Omit<BaseSvgProps, "viewBox" | "children">;
