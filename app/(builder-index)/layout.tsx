import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Builder Index",
};

export default function BuilderIndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh max-w-3xl mx-auto py-4 px-4">
      <Navbar />
      <main className="flex flex-col h-full">{children}</main>
    </div>
  );
}
