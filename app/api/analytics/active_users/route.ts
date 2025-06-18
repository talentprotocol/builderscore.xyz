import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import {
  GoogleAnalyticsActiveUserData,
  GoogleAnalyticsApiResponse,
} from "@/app/types/rewards/googleAnalytics";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";

const PROPERTY_ID = process.env.GA_PROPERTY_ID;

const getActiveUsersData = unstable_cache(
  async () => {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA_CLIENT_EMAIL,
        private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
    });

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name: "date",
        },
      ],
      metrics: [
        {
          name: "activeUsers",
        },
      ],
    });

    const formattedData =
      response.rows?.map((row) => {
        const date = row.dimensionValues?.[0].value || "";
        const formattedDate = date
          ? `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`
          : "";
        const activeUsers = parseInt(row.metricValues?.[0].value || "0", 10);

        return {
          date: formattedDate,
          activeUsers,
        } as GoogleAnalyticsActiveUserData;
      }) || [];

    formattedData.sort(
      (a: GoogleAnalyticsActiveUserData, b: GoogleAnalyticsActiveUserData) =>
        a.date.localeCompare(b.date),
    );

    return {
      success: true,
      data: formattedData,
    };
  },
  [CACHE_TAGS.ANALYTICS_ACTIVE_USERS],
  { revalidate: CACHE_60_MINUTES },
);

export async function GET() {
  try {
    const result = await getActiveUsersData();
    return NextResponse.json(result);
  } catch (error) {
    const errorResponse: GoogleAnalyticsApiResponse = {
      success: false,
      data: [],
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
