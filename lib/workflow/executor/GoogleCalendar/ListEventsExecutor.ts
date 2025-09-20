import { ExecutionEnviornment } from "@/lib/types";
import { GoogleCalendarTask } from "../../task/GoogleCalendar";
import { getCredentialValue } from "@/lib/credential-helper";

export async function ListEventsExecutor(
  enviornment: ExecutionEnviornment<typeof GoogleCalendarTask>
): Promise<boolean> {
  try {
    const credentialId = enviornment.getInput("Credentials");

    if (!credentialId) {
      enviornment.log.error("Google Calendar credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.access_token) {
      enviornment.log.error("Invalid Google Calendar credentials");
      return false;
    }

    const listUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`;

    const response = await fetch(listUrl, {
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.statusText}`);
    }

    const data = await response.json();
    enviornment.setOutput("Events", JSON.stringify(data.items || []));
    enviornment.setOutput("Count", String(data.items?.length || 0));
    enviornment.log.info(`Retrieved ${data.items?.length || 0} events`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}