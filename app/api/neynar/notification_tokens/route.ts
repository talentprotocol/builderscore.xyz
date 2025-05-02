import { NextRequest, NextResponse } from "next/server";
import {
  fetchNotificationTokens,
  processNotificationTokensData,
  calculateCumulativeData,
} from "@/app/services/neynar";
import {
  NotificationTokensApiResponse,
  NotificationTokensParams,
  NotificationToken,
} from "@/app/types/neynar";

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

    return NextResponse.json({
      success: true,
      data: processedData,
      cumulativeData,
      raw: allTokens,
    });
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
