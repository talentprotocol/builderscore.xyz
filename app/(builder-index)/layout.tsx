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
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-4">
      <Navbar />
      <main className="flex h-full flex-col">{children}</main>
    </div>
  );
}
