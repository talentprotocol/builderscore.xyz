import MainLayout from "@/app/components/MainLayout";
import MiniAppBanner from "@/app/components/MiniAppBanner";
import Navbar from "@/app/components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Builder Index",
};

export default function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout themeClassName="dark">
      <MiniAppBanner />
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-4">
        <Navbar title={metadata.title as string} />
        <main className="flex h-full flex-col">{children}</main>
      </div>
    </MainLayout>
  );
}
