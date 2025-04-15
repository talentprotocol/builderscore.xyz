import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/app/components/Navbar";
import { SponsorProvider } from "@/app/context/SponsorContext";
import { GrantProvider } from "@/app/context/GrantContext";
import { LeaderboardProvider } from "@/app/context/LeaderboardContext";
import { ThemeProvider } from "@/app/context/ThemeContext";
import UserStatus from "@/app/components/UserStatus";
import { UserProvider } from "@/app/context/UserContext";
import { Footer } from "@/app/components/Footer";
import WarpcastBanner from "@/app/components/WarpcastBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const frame = {
  version: "next",
  imageUrl: "https://www.builderscore.xyz/images/frame-image.png",
  button: {
    title: "Earn Builder Rewards",
    action: {
      type: "launch_frame",
      name: "Builder Rewards",
      url: "https://www.builderscore.xyz",
      splashImageUrl: "https://www.builderscore.xyz/images/icon.png",
      splashBackgroundColor: "#0D0740",
    },
  },
};

export const metadata: Metadata = {
  title: "Builder Rewards",
  description: "Weekly Rewards for the most impactful builders.",
  openGraph: {
    title: "Builder Rewards",
    description: "Weekly Rewards for the most impactful builders.",
    images: [
      {
        url: "https://www.builderscore.xyz/images/frame-image.png",
        alt: "Builder Rewards",
      },
    ],
  },
  other: {
    "fc:frame": JSON.stringify(frame)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <SponsorProvider>
          <GrantProvider>
            <UserProvider>
              <LeaderboardProvider>
                <ThemeProvider>
                  <WarpcastBanner />
                  <div className="flex flex-col min-h-dvh max-w-3xl mx-auto py-4 px-4">
                    {process.env.NODE_ENV === "development" && <UserStatus />}
                    <Navbar />
                    <main className="flex flex-col h-full">{children}</main>
                    <Footer />
                  </div>
                </ThemeProvider>
              </LeaderboardProvider>
            </UserProvider>
          </GrantProvider>
        </SponsorProvider>
      </body>
      <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID!} />
    </html>
  );
}
