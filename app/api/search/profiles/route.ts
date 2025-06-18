import { searchProfiles } from "@/app/services/search/profiles";
import { NextRequest, NextResponse } from "next/server";
import { RuleGroupType } from "react-querybuilder";

export async function POST(request: NextRequest) {
  try {
    const filters = await request.json();

    if (!filters) {
      return NextResponse.json(
        { error: "No filters provided" },
        { status: 400 },
      );
    }

    if (!(filters as RuleGroupType)) {
      return NextResponse.json({ error: "Invalid filters" }, { status: 400 });
    }

    const data = await searchProfiles(filters);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error searching profiles: " + error },
      { status: 500 },
    );
  }
}
