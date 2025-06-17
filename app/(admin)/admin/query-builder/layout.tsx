import MainLayout from "@/app/components/MainLayout";
import Navbar from "@/app/components/Navbar";
import QueryClientProviders from "@/app/components/QueryClientProviders";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talent Index",
};

export default function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProviders>
      <MainLayout themeClassName="dark" dataSponsor="talent-protocol">
        <div className="mx-auto flex min-h-dvh flex-col px-4 py-4">
          <Navbar title={metadata.title as string} />
          <main className="flex h-full flex-col">{children}</main>
        </div>
      </MainLayout>
    </QueryClientProviders>
  );
}
