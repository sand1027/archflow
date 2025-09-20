import { ExecutionEnviornment } from "@/lib/types";
import { GoogleCalendarTask } from "../../task/GoogleCalendar";
import { getCredentialValue } from "@/lib/credential-helper";

export async function UpdateEventExecutor(
  enviornment: ExecutionEnviornment<typeof GoogleCalendarTask>
): Promise<boolean> {
  try {
    const eventId = enviornment.getInput("Event ID");
    const title = enviornment.getInput("Title");
    const startTime = enviornment.getInput("Start Time");
    const endTime = enviornment.getInput("End Time");
    const description = enviornment.getInput("Description");
    const credentialId = enviornment.getInput("Credentials");

    if (!eventId) {
      enviornment.log.error("Event ID is required for update operation");
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

    const updateData: any = {};
    if (title) updateData.summary = title;
    if (description) updateData.description = description;
    if (startTime) updateData.start = { dateTime: startTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
    if (endTime) updateData.end = { dateTime: endTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };

    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.statusText}`);
    }

    const updatedEvent = await response.json();
    enviornment.setOutput("Event ID", updatedEvent.id);
    enviornment.setOutput("Event URL", updatedEvent.htmlLink);
    enviornment.log.info(`Event ${eventId} updated successfully`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}