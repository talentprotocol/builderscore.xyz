import Navbar from "@/app/components/Navbar";
import { Footer } from "@/app/components/rewards/Footer";
import RewardsStatus from "@/app/components/rewards/RewardsStatus";
import UserStatus from "@/app/components/rewards/UserStatus";
import { GrantProvider } from "@/app/context/GrantContext";
import { LeaderboardProvider } from "@/app/context/LeaderboardContext";
import { SponsorProvider } from "@/app/context/SponsorContext";

export default async function BuilderRewardsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SponsorProvider>
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
    </SponsorProvider>
  );
}
