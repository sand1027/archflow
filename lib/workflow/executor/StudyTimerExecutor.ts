import { ExecutionEnviornment } from "@/lib/types";
import { StudyTimerTask } from "../task/StudyTimer";

export async function StudyTimerExecutor(
  environment: ExecutionEnviornment<typeof StudyTimerTask>
): Promise<boolean> {
  try {
    const studyDuration = parseInt(environment.getInput("Study Duration")) || 25;
    const breakDuration = parseInt(environment.getInput("Break Duration")) || 5;
    const sessions = parseInt(environment.getInput("Sessions")) || 4;
    const notificationMethod = environment.getInput("Notification Method");
    const notificationTarget = environment.getInput("Notification Target");

    let totalTime = 0;
    
    for (let i = 1; i <= sessions; i++) {
      // Study session
      environment.log.info(`Starting study session ${i}/${sessions} (${studyDuration} min)`);
      await new Promise(resolve => setTimeout(resolve, studyDuration * 60 * 1000));
      totalTime += studyDuration;

      // Send break notification
      if (i < sessions) {
        const breakMessage = `Study session ${i} complete! Take a ${breakDuration}-minute break.`;
        await sendNotification(notificationMethod, notificationTarget, breakMessage);
        
        // Break time
        await new Promise(resolve => setTimeout(resolve, breakDuration * 60 * 1000));
        totalTime += breakDuration;
      }
    }

    const completionMessage = `Pomodoro session complete! Total study time: ${sessions * studyDuration} minutes.`;
    await sendNotification(notificationMethod, notificationTarget, completionMessage);

    environment.setOutput("Session Status", "completed");
    environment.setOutput("Total Time", totalTime.toString());
    return true;
  } catch (error: any) {
    environment.log.error(`Study Timer failed: ${error.message}`);
    return false;
  }
}

async function sendNotification(method: string, target: string, message: string) {
  // This would integrate with existing notification executors
  // For now, just log the notification
  console.log(`[${method.toUpperCase()}] ${target}: ${message}`);
}