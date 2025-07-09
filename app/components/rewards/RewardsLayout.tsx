import MainLayout from "@/app/components/MainLayout";
import QueryClientProviders from "@/app/components/QueryClientProviders";
import { Footer } from "@/app/components/rewards/Footer";
import RewardsNavbar from "@/app/components/rewards/RewardsNavbar";
import SponsorNavbar from "@/app/components/rewards/SponsorNavbar";
import StatusToggle from "@/app/components/rewards/StatusToggle";
import { GrantProvider } from "@/app/context/GrantContext";
import { LeaderboardProvider } from "@/app/context/LeaderboardContext";
import { SponsorProvider } from "@/app/context/SponsorContext";
import { DEFAULT_SPONSOR_SLUG } from "@/app/lib/constants";
import { getQueryClient } from "@/app/lib/get-query-client";
import { buildNestedQuery } from "@/app/lib/react-querybuilder-utils";
import { fetchSearchAdvanced } from "@/app/services/index/search-advanced";
import { fetchGrants } from "@/app/services/rewards/grants";
import { fetchSponsors } from "@/app/services/rewards/sponsors";
import { AdvancedSearchRequest } from "@/app/types/advancedSearchRequest";
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

  const requestBody: AdvancedSearchRequest = {
    query: {
      customQuery: buildNestedQuery({
        combinator: "and",
        rules: [],
      }),
    },
    sort: {
      score: {
        order: "desc",
      },
      id: {
        order: "desc",
      },
    },
    page: 1,
    per_page: 20,
  };

  const queryString = Object.keys(requestBody)
    .map(
      (key) =>
        `${key}=${encodeURIComponent(JSON.stringify(requestBody[key as keyof AdvancedSearchRequest]))}`,
    )
    .join("&");

  const [sponsors, grants] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: ["sponsors"],
      queryFn: () => fetchSponsors(),
    }),
    queryClient.fetchQuery({
      queryKey: ["grants", sponsor],
      queryFn: () => fetchGrants({ sponsor_slug: sponsor }),
    }),
    queryClient.fetchInfiniteQuery({
      queryKey: ["infiniteSearchProfiles", ""],
      queryFn: () =>
        fetchSearchAdvanced({
          documents: "profiles",
          queryString: queryString,
        }),
      initialPageParam: 1,
    }),
  ]);

  const initialSponsor = sponsors.sponsors.find((s) => s.slug === sponsor);

  return (
    <MainLayout themeClassName={themeClassName} dataSponsor={sponsor}>
      <QueryClientProviders>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SponsorProvider
            initialSponsor={
              initialSponsor ||
              sponsors.sponsors.find((s) => s.slug === DEFAULT_SPONSOR_SLUG) ||
              null
            }
          >
            <GrantProvider initialGrant={grants.grants[0]}>
              <LeaderboardProvider>
                <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col px-4 pt-4 pb-16 sm:pb-20">
                  <SponsorNavbar title={title} sponsor={sponsor} />
                  <main className="flex h-full flex-col">{children}</main>
                  <Footer />
                  <RewardsNavbar />
                </div>

                {process.env.NODE_ENV === "development" && <StatusToggle />}
              </LeaderboardProvider>
            </GrantProvider>
          </SponsorProvider>
        </HydrationBoundary>
      </QueryClientProviders>
    </MainLayout>
  );
}
