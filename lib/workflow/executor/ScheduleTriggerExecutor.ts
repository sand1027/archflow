import { ExecutionEnviornment } from "@/lib/types";
import { ScheduleTriggerTask } from "../task/ScheduleTrigger";

export async function ScheduleTriggerExecutor(
  enviornment: ExecutionEnviornment<typeof ScheduleTriggerTask>
): Promise<boolean> {
  try {
    const scheduleType = enviornment.getInput("Schedule Type");
    const time = enviornment.getInput("Time");
    const daysOfWeek = enviornment.getInput("Days of Week");
    const specificDate = enviornment.getInput("Specific Date");
    const timezone = enviornment.getInput("Timezone") || "UTC";
    const customCron = enviornment.getInput("Custom Cron");
    
    if (!scheduleType || !time) {
      enviornment.log.error("Schedule Type and Time are required");
      return false;
    }
    
    let cronExpression = "";
    let scheduleDescription = "";
    
    // Generate cron expression based on user-friendly inputs
    if (customCron) {
      cronExpression = customCron;
      scheduleDescription = `Custom: ${customCron}`;
    } else {
      const hour = parseInt(time);
      
      switch (scheduleType) {
        case "once":
          if (!specificDate) {
            enviornment.log.error("Specific Date is required for single run");
            return false;
          }
          const targetDate = new Date(specificDate);
          cronExpression = `0 ${hour} ${targetDate.getDate()} ${targetDate.getMonth() + 1} *`;
          scheduleDescription = `Once on ${specificDate} at ${hour}:00`;
          break;
          
        case "daily":
          cronExpression = `0 ${hour} * * *`;
          scheduleDescription = `Daily at ${hour}:00`;
          break;
          
        case "weekly":
          const days = daysOfWeek || "*";
          cronExpression = `0 ${hour} * * ${days}`;
          scheduleDescription = `Weekly on ${days === "*" ? "every day" : days === "1-5" ? "weekdays" : "selected days"} at ${hour}:00`;
          break;
          
        case "monthly":
          cronExpression = `0 ${hour} 1 * *`;
          scheduleDescription = `Monthly on 1st at ${hour}:00`;
          break;
          
        default:
          cronExpression = `0 ${hour} * * *`;
          scheduleDescription = `Daily at ${hour}:00`;
      }
    }
    
    enviornment.log.info(`Schedule trigger: ${scheduleDescription} (${timezone})`);
    enviornment.log.info(`Generated cron: ${cronExpression}`);
    
    enviornment.setOutput("Timestamp", new Date().toISOString());
    enviornment.setOutput("Schedule Info", scheduleDescription);
    
    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}