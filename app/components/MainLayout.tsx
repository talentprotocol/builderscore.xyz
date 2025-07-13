import { ThemeProvider } from "@/app/context/ThemeContext";
import { UserProvider } from "@/app/context/UserContext";
import { cn } from "@/app/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function MainLayout({
  children,
  themeClassName,
  dataSponsor,
}: {
  children: React.ReactNode;
  themeClassName: string;
  dataSponsor: string;
}) {
  return (
    <html
      lang="en"
      className={cn(themeClassName, "scrollbar-hide")}
      data-sponsor={dataSponsor}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <NuqsAdapter>
            <UserProvider>{children}</UserProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID!} />
    </html>
  );
}
