import { getAppUrl } from "@/lib/helper";
import initDB, { Workflow } from "@/lib/prisma";
import { WorkflowStatus } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const now = new Date();

  await initDB();
  const workflows = await Workflow.find({
    status: WorkflowStatus.PUBLISHED,
    cron: { $ne: null },
    nextRunAt: { $lte: now },
  }).select('_id');

  for (const workflow of workflows) {
    triggerWorkflow(workflow._id.toString());
  }
  return Response.json({ workflowsToRun: workflows.length }, { status: 200 });
}

function triggerWorkflow(wofkflowId: string) {
  const triggerApiUrl = getAppUrl(
    `api/workflows/execute?workflowId=${wofkflowId}`
  );
  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET!}`,
    },
    cache: "no-store",
  }).catch((error: any) => {
    console.error(
      "Error triggering workflow with id",
      wofkflowId,
      ":error->",
      error.message
    );
  });
}