import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { CreateEventExecutor, ListEventsExecutor, UpdateEventExecutor, DeleteEventExecutor } from "./GoogleCalendar";

export async function GoogleCalendarExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.GOOGLE_CALENDAR }>
): Promise<boolean> {
  const action = enviornment.getInput("Action");

  if (!action) {
    enviornment.log.error("Action is required");
    return false;
  }

  switch (action) {
    case "create_event":
      return await CreateEventExecutor(enviornment as any);
    case "list_events":
      return await ListEventsExecutor(enviornment as any);
    case "update_event":
      return await UpdateEventExecutor(enviornment as any);
    case "delete_event":
      return await DeleteEventExecutor(enviornment as any);
    default:
      enviornment.log.error(`Unknown action: ${action}`);
      return false;
  }
}