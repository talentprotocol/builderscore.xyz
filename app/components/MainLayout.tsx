import { ThemeProvider } from "@/app/context/ThemeContext";
import { UserProvider } from "@/app/context/UserContext";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="en" className={themeClassName} data-sponsor={dataSponsor}>
      <body className={`${inter.variable} antialiased`}>
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
