import { NextRequest, NextResponse } from "next/server";
import { getActiveUsers } from "@/lib/sse-connections";

export async function GET(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  try {
    const activeUsers = await getActiveUsers(params.workflowId);
    return NextResponse.json(activeUsers);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}