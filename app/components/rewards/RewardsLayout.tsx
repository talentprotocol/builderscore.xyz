import MainLayout from "@/app/components/MainLayout";
import QueryClientProviders from "@/app/components/QueryClientProviders";
import { Footer } from "@/app/components/rewards/Footer";
import RewardsStatus from "@/app/components/rewards/RewardsStatus";
import SponsorNavbar from "@/app/components/rewards/SponsorNavbar";
import UserStatus from "@/app/components/rewards/UserStatus";
import { GrantProvider } from "@/app/context/GrantContext";
import { LeaderboardProvider } from "@/app/context/LeaderboardContext";
import { SponsorProvider } from "@/app/context/SponsorContext";
import { getQueryClient } from "@/app/lib/get-query-client";
import { fetchGrants } from "@/app/services/rewards/grants";
import { fetchSponsors } from "@/app/services/rewards/sponsors";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function RewardsLayout({
  children,
  themeClassName,
  title,
  sponsor,
}: Readonly<{
  children: React.ReactNode;
  themeClassName: string;
  title: string;
  sponsor: string;
}>) {
  const queryClient = getQueryClient();

  const [sponsors, grants] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: ["sponsors"],
      queryFn: () => fetchSponsors(),
    }),
    queryClient.fetchQuery({
      queryKey: ["grants", sponsor],
      queryFn: () => fetchGrants({ sponsor_slug: sponsor }),
    }),
  ]);

  const initialSponsor = sponsors.sponsors.find((s) => s.slug === sponsor);

  return (
    <MainLayout themeClassName={themeClassName} dataSponsor={sponsor}>
      <QueryClientProviders>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SponsorProvider initialSponsor={initialSponsor || null}>
            <GrantProvider initialGrant={grants.grants[0]}>
              <LeaderboardProvider>
                <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-4">
                  {process.env.NODE_ENV === "development" && (
                    <>
                      <UserStatus />
                      <RewardsStatus />
                    </>
                  )}
                  <SponsorNavbar title={title} sponsor={sponsor} />
                  <main className="flex h-full flex-col">{children}</main>
                  <Footer />
                </div>
              </LeaderboardProvider>
            </GrantProvider>
          </SponsorProvider>
        </HydrationBoundary>
      </QueryClientProviders>
    </MainLayout>
  );
}
