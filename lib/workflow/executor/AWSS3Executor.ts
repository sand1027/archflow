import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { UploadExecutor, DownloadExecutor, ListExecutor } from "./AWSS3";

export async function AWSS3Executor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.AWS_S3 }>
): Promise<boolean> {
  const action = enviornment.getInput("Action");

  if (!action) {
    enviornment.log.error("Action is required");
    return false;
  }

  switch (action) {
    case "upload":
      return await UploadExecutor(enviornment as any);
    case "download":
      return await DownloadExecutor(enviornment as any);
    case "list":
      return await ListExecutor(enviornment as any);
    case "delete":
      // Delete functionality can be added later
      enviornment.log.error("Delete action not yet implemented");
      return false;
    default:
      enviornment.log.error(`Unknown action: ${action}`);
      return false;
  }
}