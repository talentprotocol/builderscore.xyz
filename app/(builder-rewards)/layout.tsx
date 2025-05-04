<<<<<<< HEAD
import Navbar from "@/app/components/Navbar";
import { Footer } from "@/app/components/rewards/Footer";
import RewardsStatus from "@/app/components/rewards/RewardsStatus";
import UserStatus from "@/app/components/rewards/UserStatus";
import { GrantProvider } from "@/app/context/GrantContext";
import { LeaderboardProvider } from "@/app/context/LeaderboardContext";
import { baseMetadata, celoMetadata } from "@/app/lib/constants";
import { Metadata } from "next";
import { headers } from "next/headers";
=======
import type { Metadata } from "next";
>>>>>>> f308ef6 (Improves layouts for SSR.)

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const headersAsObject: { [key: string]: string } = {};
  requestHeaders.forEach((value, key) => {
    headersAsObject[key] = value;
  });
  const subdomain = headersAsObject["x-current-subdomain"];

<<<<<<< HEAD
  let metadata;

  switch (subdomain) {
    case "base":
      metadata = baseMetadata;
      break;
    case "celo":
      metadata = celoMetadata;
      break;
    case "talent-protocol":
      metadata = baseMetadata;
      break;
    default:
      metadata = baseMetadata;
  }

  return metadata;
}

=======
>>>>>>> f308ef6 (Improves layouts for SSR.)
export default async function BuilderRewardsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
<<<<<<< HEAD
  return (
    <GrantProvider>
      <LeaderboardProvider>
        <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-4">
          {process.env.NODE_ENV === "development" && (
            <>
              <UserStatus />
              <RewardsStatus />
            </>
          )}
          <Navbar sponsored />
          <main className="flex h-full flex-col">{children}</main>
          <Footer />
        </div>
      </LeaderboardProvider>
    </GrantProvider>
  );
=======
  return <>{children}</>;
>>>>>>> f308ef6 (Improves layouts for SSR.)
}
