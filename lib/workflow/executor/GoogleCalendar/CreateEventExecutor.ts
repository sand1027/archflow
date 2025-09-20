import { ExecutionEnviornment } from "@/lib/types";
import { GoogleCalendarTask } from "../../task/GoogleCalendar";
import { getCredentialValue } from "@/lib/credential-helper";

export async function CreateEventExecutor(
  enviornment: ExecutionEnviornment<typeof GoogleCalendarTask>
): Promise<boolean> {
  try {
    const title = enviornment.getInput("Title");
    const startTime = enviornment.getInput("Start Time");
    const endTime = enviornment.getInput("End Time");
    const description = enviornment.getInput("Description");
    const sheetsData = enviornment.getInput("Data");
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

    // Handle Google Sheets data if connected
    if (sheetsData) {
      enviornment.log.info(`Processing Google Sheets data: ${sheetsData}`);
      
      let parsedData;
      try {
        parsedData = JSON.parse(sheetsData);
      } catch {
        enviornment.log.error("Invalid JSON data from Google Sheets");
        return false;
      }
      
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        let createdCount = 0;
        const eventIds = [];
        
        for (let i = 0; i < parsedData.length; i++) {
          const row = parsedData[i];
          if (Array.isArray(row) && row.length >= 2) {
            const eventTitle = row[0];
            const dueDate = row[1];
            const eventDesc = row[2] || '';
            
            // Skip header row
            if (i === 0 && (eventTitle.toLowerCase().includes('name') || dueDate.toLowerCase().includes('date'))) {
              enviornment.log.info(`Skipping header row: ${eventTitle}`);
              continue;
            }
            
            if (eventTitle && dueDate) {
              try {
                const eventData = {
                  summary: eventTitle,
                  description: eventDesc,
                  start: {
                    dateTime: `${dueDate}T09:00:00`,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                  },
                  end: {
                    dateTime: `${dueDate}T10:00:00`,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                  }
                };
                
                const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${credentials.access_token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(eventData)
                });
                
                if (response.ok) {
                  const createdEvent = await response.json();
                  eventIds.push(createdEvent.id);
                  createdCount++;
                  enviornment.log.info(`Created event: ${eventTitle} on ${dueDate}`);
                } else {
                  enviornment.log.error(`Failed to create event ${eventTitle}: ${response.statusText}`);
                }
              } catch (error: any) {
                enviornment.log.error(`Error creating event ${eventTitle}: ${error.message}`);
              }
            }
          }
        }
        
        enviornment.setOutput("Event ID", eventIds.join(','));
        enviornment.setOutput("Count", String(createdCount));
        enviornment.log.info(`Successfully created ${createdCount} events from spreadsheet data`);
        return true;
      }
    }
    
    // Handle manual single event creation
    const eventTitle = title || "New Event";
    const eventStart = startTime || new Date().toISOString();
    const eventEnd = endTime || new Date(Date.now() + 3600000).toISOString();

    const eventData = {
      summary: eventTitle,
      description: description || '',
      start: {
        dateTime: eventStart,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: eventEnd,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.statusText}`);
    }

    const createdEvent = await response.json();
    enviornment.setOutput("Event ID", createdEvent.id);
    enviornment.setOutput("Event URL", createdEvent.htmlLink);
    enviornment.log.info(`Event "${eventTitle}" created successfully with ID: ${createdEvent.id}`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}