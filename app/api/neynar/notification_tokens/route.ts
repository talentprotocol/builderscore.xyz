import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import {
  calculateCumulativeData,
  fetchNotificationTokens,
  processNotificationTokensData,
} from "@/app/services/rewards/neynar";
import {
  NotificationToken,
  NotificationTokensApiResponse,
  NotificationTokensParams,
} from "@/app/types/rewards/neynar";
import { NextRequest, NextResponse } from "next/server";

const getNotificationTokensData = unstable_cache(
  async (params: NotificationTokensParams) => {
    let allTokens: NotificationToken[] = [];
    let hasMore = true;
    let currentCursor: string | undefined = undefined;

    while (hasMore) {
      const queryParams = { ...params };
      if (currentCursor) {
        queryParams.cursor = currentCursor;
      }

      const response = await fetchNotificationTokens(queryParams);
      allTokens = [...allTokens, ...response.notification_tokens];

      if (response.next?.cursor) {
        currentCursor = response.next.cursor;
      } else {
        hasMore = false;
      }

      if (allTokens.length >= 1000) {
        hasMore = false;
      }
    }

    const processedData = processNotificationTokensData(allTokens);
    const cumulativeData = calculateCumulativeData(processedData);

    return {
      success: true,
      data: processedData,
      cumulativeData,
      raw: allTokens,
    };
  },
  [CACHE_TAGS.NOTIFICATION_TOKENS],
  { revalidate: CACHE_60_MINUTES },
);

export async function GET(
  request: NextRequest,
): Promise<NextResponse<NotificationTokensApiResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    const params: NotificationTokensParams = {
      limit: searchParams.has("limit")
        ? parseInt(searchParams.get("limit")!)
        : 100,
    };

    const result = await getNotificationTokensData(params);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        cumulativeData: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch notification tokens",
      },
      { status: 500 },
    );
  }
}
