import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Workflow } from "@/schema/workflows";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  try {
    // Require authentication
    const auth = await getCurrentUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    console.log('Fetching workflow:', params.workflowId);
    const workflow = await Workflow.findById(params.workflowId).lean();
    
    if (!workflow) {
      console.log('Workflow not found:', params.workflowId);
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }
    
    console.log('Found workflow:', params.workflowId);
    return NextResponse.json(workflow);
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return NextResponse.json({ error: "Failed to fetch workflow" }, { status: 500 });
  }
}