import MiniAppBanner from "@/app/components/MiniAppBanner";
import { SponsorProvider } from "@/app/context/SponsorContext";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { UserProvider } from "@/app/context/UserContext";
import "@/app/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talent Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <UserProvider>
            <SponsorProvider>
              <MiniAppBanner />
              {children}
            </SponsorProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID!} />
    </html>
  );
}
