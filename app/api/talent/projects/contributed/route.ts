import { fetchTalentContributedProjects } from "@/app/services/talent";
import { TalentContributedProjectsResponse } from "@/app/types/talent";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");
  const per_page = searchParams.get("per_page");
  const page = searchParams.get("page");

  if (!uuid) {
    return NextResponse.json(
      { error: "Talent UUID is required" },
      { status: 400 },
    );
  }

  try {
    const params = {
      ...(per_page && { per_page: parseInt(per_page) }),
      ...(page && { page: parseInt(page) }),
    };

    const data: TalentContributedProjectsResponse | null =
      await fetchTalentContributedProjects(uuid, params);

    if (!data) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch contributed projects: ${error}` },
      { status: 500 },
    );
  }
}
