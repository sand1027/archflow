"use server";

import initDB, { Workflow } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function cleanupOldWorkflows() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  
  const oldTaskTypes = [
    'LAUNCH_BROWSER',
    'PAGE_TO_HTML', 
    'EXTRACT_TEXT_FROM_ELEMENT',
    'FILL_INPUT',
    'CLICK_ELEMENT',
    'WAIT_FOR_ELEMENT',
    'EXTRACT_DATA_WITH_AI',
    'NAVIGATE_URL',
    'SCROLL_TO_ELEMENT'
  ];

  // Find workflows with old task types
  const workflows = await Workflow.find({ userId }).lean();
  
  for (const workflow of workflows) {
    try {
      const definition = JSON.parse(workflow.definition);
      const hasOldTaskTypes = definition.nodes?.some((node: any) => 
        oldTaskTypes.includes(node.data?.type)
      );
      
      if (hasOldTaskTypes) {
        await Workflow.findByIdAndDelete(workflow._id);
        console.log(`Deleted workflow with old task types: ${workflow.name}`);
      }
    } catch (e) {
      // Skip invalid JSON
      continue;
    }
  }
  
  return { success: true };
}