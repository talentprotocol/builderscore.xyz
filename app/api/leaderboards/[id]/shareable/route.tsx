import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { formatDateRange, formatNumber } from "@/app/lib/utils";
import { Grant } from "@/app/types/rewards/grants";
import { LeaderboardEntry } from "@/app/types/rewards/leaderboards";
import { ImageResponse } from "@vercel/og";
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const fetchLeaderboardById = unstable_cache(
  async (id: string, queryString: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${ENDPOINTS.leaderboards}/${id}?${queryString}`,
        {
          headers: DEFAULT_HEADERS,
        },
      );

      return response.data;
    } catch (err) {
      const error = err as AxiosError<Error>;

      if (error.response?.status === 404) {
        throw new Error("NOT_FOUND");
      }
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
  },
  [CACHE_TAGS.LEADERBOARD_BY_ID],
  { revalidate: CACHE_60_MINUTES },
);

const fetchGrantById = unstable_cache(
  async (id: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${ENDPOINTS.grants}/${id}`,
        {
          headers: DEFAULT_HEADERS,
        },
      );

      return response.data;
    } catch (err) {
      const error = err as AxiosError<Error>;

      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
  },
  [CACHE_TAGS.GRANT_BY_ID],
  { revalidate: CACHE_60_MINUTES },
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;

    const grant_id = searchParams.get("grant_id");
    const sponsor_slug = searchParams.get("sponsor_slug");

    const queryParams = new URLSearchParams({
      ...(grant_id && { grant_id }),
      ...(sponsor_slug && { sponsor_slug }),
    });

    if (!grant_id) {
      return NextResponse.json(
        { error: "Grant ID is required" },
        { status: 400 },
      );
    }

    const leaderboardData: LeaderboardEntry = await fetchLeaderboardById(
      id,
      queryParams.toString(),
    );
    const grantData: Grant = await fetchGrantById(grant_id!);

    const ranking = leaderboardData.leaderboard_position?.toString();
    const rewards = formatNumber(parseFloat(leaderboardData.reward_amount!), 3);
    const ticker = grantData.token_ticker;
    const dates = formatDateRange(grantData.start_date, grantData.end_date);
    const name =
      leaderboardData.profile.display_name ||
      leaderboardData.profile.name ||
      "Builder";
    const image_url =
      leaderboardData.profile.image_url ||
      `${process.env.BUILDER_REWARDS_URL}/images/default_avatar.png`;

    const dmMonoLight = await axios
      .get(`${process.env.BUILDER_REWARDS_URL}/fonts/DMMono-Light.ttf`, {
        responseType: "arraybuffer",
      })
      .then((response) => response.data);

    const dmMonoMedium = await axios
      .get(`${process.env.BUILDER_REWARDS_URL}/fonts/DMMono-Medium.ttf`, {
        responseType: "arraybuffer",
      })
      .then((response) => response.data);

    return new ImageResponse(
      (
        <div tw="flex flex-col items-center justify-center border-2 border-red-500 w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.BUILDER_REWARDS_URL}/images/shareable-background.png`}
            alt="Shareable Background"
            width={1620}
            height={1080}
          />

          <div tw="flex flex-col justify-between absolute top-12 left-12 w-[1080px] h-[920px] p-[50px] pt-[70px] pb-[120px]">
            <div tw="flex flex-col">
              <p tw="text-[50px] text-[#C8DBFE] mb-0">{dates}</p>
              <p
                tw="text-[100px] font-bold text-[#C8DBFE] mt-0 ml-[-10px]"
                style={{ fontFamily: "DM Mono Medium" }}
              >
                {name}
              </p>
            </div>

            <div tw="flex flex-col">
              <div tw="flex relative">
                <div tw="flex flex-col items-center justify-center w-[420px] h-[420px] overflow-hidden rounded-full border-[5px] border-[#C8DBFE]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image_url} alt="Image URL" tw="h-full" />
                </div>

                <div tw="flex flex-col items-center justify-center absolute top-[-30px] left-[-30px] bg-[#C8DBFE] rounded-full p-[20px]">
                  <p
                    tw="text-[50px] font-bold text-[#120A36] text-center"
                    style={{ fontFamily: "DM Mono Medium" }}
                  >
                    #{ranking}
                  </p>
                </div>

                <div tw="flex flex-col items-start absolute bottom-[-50px] right-[0px]">
                  <p tw="text-[80px] text-[#120A36] bg-[#C8DBFE] rounded-full p-[40px]">
                    {rewards} {ticker}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1620,
        height: 1080,
        fonts: [
          {
            name: "DM Mono Light",
            data: dmMonoLight,
            style: "normal",
          },
          {
            name: "DM Mono Medium",
            data: dmMonoMedium,
            style: "normal",
          },
        ],
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") {
        return NextResponse.json(
          { error: "Leaderboard not found" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { error: `Failed to generate shareable image: ${error}` },
      { status: 500 },
    );
  }
}
