import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BUILDER_REWARDS_URL || process.env.NEXT_PUBLIC_BUILDER_REWARDS_URL || 'http://localhost:3000'),
  title: "Talent Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
