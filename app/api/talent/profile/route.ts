import { fetchTalentProfile } from "@/app/services/talent";
import {
  fetchTalentAccounts,
  fetchTalentBuilderScore,
  fetchTalentCredentials,
  fetchTalentCredentialsDatapoints,
  fetchTalentSocials,
} from "@/app/services/talent";
import { TalentProfileApi } from "@/app/types/talent";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json(
      { error: "FID parameter is required" },
      { status: 400 },
    );
  }

  try {
    const [
      profileData,
      socialsData,
      builderScoreData,
      accountsData,
      credentialsData,
      celoOutTransactionsData,
    ] = await Promise.all([
      fetchTalentProfile(fid),
      fetchTalentSocials(fid),
      fetchTalentBuilderScore(fid),
      fetchTalentAccounts(fid),
      fetchTalentCredentials(fid),
      fetchTalentCredentialsDatapoints(fid, "celo_out_transactions"),
    ]);

    if (
      !profileData.profile ||
      !socialsData ||
      !builderScoreData ||
      !accountsData ||
      !credentialsData ||
      !celoOutTransactionsData
    ) {
      return NextResponse.json({ profile: null });
    }

    const farcasterSocial = socialsData.socials.find(
      (social: { source: string }) => social.source === "farcaster",
    );

    if (farcasterSocial) {
      const matchingProfile: TalentProfileApi = profileData.profile;

      const hasGithubCredential = socialsData.socials.some(
        (social: { source: string }) => social.source === "github",
      );

      const basenameSocial = socialsData.socials.find(
        (social: { source: string; handle: string }) =>
          social.source === "basename",
      );

      const hasSelfXyzAccount = accountsData.accounts.some(
        (account: { source: string }) => account.source === "self",
      );

      const hasCeloTransactionCredential =
        celoOutTransactionsData?.data_points.some(
          (datapoint: { credential_slug: string; readable_value: string }) =>
            datapoint.credential_slug === "celo_out_transactions" &&
            parseInt(datapoint.readable_value, 10) > 0,
        );

      return NextResponse.json({
        profile: matchingProfile,
        github: hasGithubCredential,
        basename: basenameSocial?.handle,
        builderScore: builderScoreData?.score,
        selfXyz: hasSelfXyzAccount,
        celoTransaction: hasCeloTransactionCredential,
      });
    }

    return NextResponse.json({ profile: null });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch Talent Protocol profile: ${error}` },
      { status: 500 },
    );
  }
}
