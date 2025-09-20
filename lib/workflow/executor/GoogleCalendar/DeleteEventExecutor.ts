import { ExecutionEnviornment } from "@/lib/types";
import { GoogleCalendarTask } from "../../task/GoogleCalendar";
import { getCredentialValue } from "@/lib/credential-helper";

export async function DeleteEventExecutor(
  enviornment: ExecutionEnviornment<typeof GoogleCalendarTask>
): Promise<boolean> {
  try {
    const eventId = enviornment.getInput("Event ID");
    const credentialId = enviornment.getInput("Credentials");

    if (!eventId) {
      enviornment.log.error("Event ID is required for delete operation");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("Google Calendar credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.access_token) {
      enviornment.log.error("Invalid Google Calendar credentials");
      return false;
    }

    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.statusText}`);
    }

    enviornment.setOutput("Event ID", eventId);
    enviornment.log.info(`Event ${eventId} deleted successfully`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}