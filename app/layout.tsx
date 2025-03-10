import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/app/components/Navbar";
import { FarcasterProvider } from "@/app/context/FarcasterContext";
import { SponsorProvider } from "@/app/context/SponsorContext";
import { GrantProvider } from "@/app/context/GrantContext";
import { LeaderboardProvider } from "@/app/context/LeaderboardContext";
import UserStatus from "@/app/components/UserStatus";
import { UserProvider } from "@/app/context/UserContext";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Builder Rewards",
  description: "Ship, Earn, Repeat.",
  other: {
    'fc:frame': JSON.stringify({
      version: 'next',
      imageUrl: "https://www.builderscore.xyz/images/frame-image.png",
      button: {
        title: "Builder Rewards",
        action: {
          type: 'launch_frame',
          name: "Ship, Earn, Repeat.",
          url: "https://www.builderscore.xyz",
          splashImageUrl: "https://www.builderscore.xyz/images/splash.png",
          splashBackgroundColor: "#000000"
        },
      },
    })
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-black text-white`}>
        <FarcasterProvider>
          <SponsorProvider>
            <GrantProvider>
              <UserProvider>
                <LeaderboardProvider>
                  <div className="flex flex-col min-h-dvh max-w-3xl mx-auto py-2 px-1">
                    {process.env.NODE_ENV === "development" && <UserStatus />}
                    <Navbar />
                    <main className="flex flex-col h-full">{children}</main>

                    <div className="py-6">
                      <p className="text-center text-neutral-500 text-sm">
                        <Link
                          className="underline"
                          href="https://talentprotocol.com"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Talent Protocol
                        </Link>
                        , {new Date().getFullYear()}
                      </p>
                    </div>
                  </div>
                </LeaderboardProvider>
              </UserProvider>
            </GrantProvider>
          </SponsorProvider>
        </FarcasterProvider>
      </body>
    </html>
  );
}
