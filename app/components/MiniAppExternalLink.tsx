import { ReactNode } from "react";
import Link from "next/link";
import { sdk } from "@farcaster/frame-sdk";
import { useUser } from "@/app/context/UserContext";

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

export default function MiniAppExternalLink({
  href,
  children,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
  onClick,
}: ExternalLinkProps) {
  const { frameContext } = useUser();

  const handleClick = async (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }

    if (frameContext) {
      e.preventDefault();
      await sdk.actions.openUrl(href);
      return;
    }
  };

  return (
    <Link
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
} 