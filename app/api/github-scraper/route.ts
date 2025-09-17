import { NextRequest, NextResponse } from "next/server";
import { scrapeGitHubRepository } from "@/actions/github";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const result = await scrapeGitHubRepository(url);
    return NextResponse.json(result);
  } catch (error) {
    console.error("GitHub scraper error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes('rate limit') ? 429 : message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}