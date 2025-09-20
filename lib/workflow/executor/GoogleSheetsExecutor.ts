import { ExecutionEnviornment } from "@/lib/types";
import { GoogleSheetsTask } from "../task/GoogleSheets";
import { getCredentialValue } from "@/lib/credential-helper";

export async function GoogleSheetsExecutor(
  enviornment: ExecutionEnviornment<typeof GoogleSheetsTask>
): Promise<boolean> {
  try {
    const action = enviornment.getInput("Action");
    const spreadsheetId = enviornment.getInput("Spreadsheet ID");
    const sheetName = enviornment.getInput("Sheet Name");
    const rangeInput = enviornment.getInput("Range");
    const range = sheetName ? `${sheetName}!${rangeInput || 'A1:Z100'}` : (rangeInput || "A1:Z100");
    const values = enviornment.getInput("Data");
    const credentialId = enviornment.getInput("Credentials");

    if (!action || !spreadsheetId) {
      enviornment.log.error("Action and Spreadsheet ID are required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("Google Sheets credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.access_token) {
      enviornment.log.error("Invalid Google Sheets credentials - access token required");
      return false;
    }

    enviornment.log.info(`Executing Google Sheets ${action} on ${spreadsheetId}`);
    
    try {
      const accessToken = credentials.access_token;
      if (!accessToken) {
        enviornment.log.error("Access token not found in credentials");
        return false;
      }

      const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
      
      switch (action) {
        case "read":
          const encodedRange = encodeURIComponent(range);
          const apiUrl = `${baseUrl}/values/${encodedRange}`;
          enviornment.log.info(`Making API request to: ${apiUrl}`);
          enviornment.log.info(`Using range: ${range}`);
          enviornment.log.info(`Encoded range: ${encodedRange}`);
          
          const readResponse = await fetch(apiUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!readResponse.ok) {
            // If sheet name fails, try without it
            if (sheetName && readResponse.status === 400) {
              enviornment.log.info(`Sheet '${sheetName}' not found, trying default range`);
              const fallbackRange = rangeInput || "A1:Z100";
              const fallbackUrl = `${baseUrl}/values/${encodeURIComponent(fallbackRange)}`;
              
              const fallbackResponse = await fetch(fallbackUrl, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                enviornment.setOutput("Data", JSON.stringify(fallbackData.values || []));
                enviornment.setOutput("Range", fallbackData.range || fallbackRange);
                enviornment.log.info(`Read ${fallbackData.values?.length || 0} rows from default sheet`);
                break;
              }
            }
            
            const errorText = await readResponse.text();
            enviornment.log.error(`API Error Response: ${errorText}`);
            throw new Error(`Google Sheets API error: ${readResponse.statusText}`);
          }
          
          const readData = await readResponse.json();
          enviornment.setOutput("Data", JSON.stringify(readData.values || []));
          enviornment.setOutput("Range", readData.range || range);
          enviornment.log.info(`Read ${readData.values?.length || 0} rows from ${range}`);
          break;
          
        case "write":
        case "append":
          if (!values) {
            enviornment.log.error("Data is required for write/append operations");
            return false;
          }
          
          enviornment.log.info(`Raw values received: ${values}`);
          
          let parsedValues;
          try {
            parsedValues = JSON.parse(values);
            enviornment.log.info(`Parsed values: ${JSON.stringify(parsedValues)}`);
          } catch {
            // If not JSON, treat as single value
            parsedValues = [[values]];
            enviornment.log.info(`Treating as single value: ${JSON.stringify(parsedValues)}`);
          }
          
          // Validate data format
          if (!Array.isArray(parsedValues)) {
            enviornment.log.error("Values must be an array");
            return false;
          }
          
          const writeUrl = action === "append" 
            ? `${baseUrl}/values/${range}:append?valueInputOption=RAW`
            : `${baseUrl}/values/${range}?valueInputOption=RAW`;
            
          enviornment.log.info(`Making request to: ${writeUrl}`);
          enviornment.log.info(`Request body: ${JSON.stringify({ values: parsedValues })}`);
            
          const writeResponse = await fetch(writeUrl, {
            method: action === "append" ? 'POST' : 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              values: parsedValues
            }),
          });
          
          if (!writeResponse.ok) {
            const errorText = await writeResponse.text();
            enviornment.log.error(`API Response: ${errorText}`);
            throw new Error(`Google Sheets API error: ${writeResponse.statusText}`);
          }
          
          const writeData = await writeResponse.json();
          enviornment.setOutput("Updated Range", writeData.updatedRange || range);
          enviornment.setOutput("Updated Rows", String(writeData.updatedRows || 0));
          enviornment.log.info(`${action} completed: ${writeData.updatedRows || 0} rows updated`);
          break;
          
        case "clear":
          const clearResponse = await fetch(`${baseUrl}/values/${range}:clear`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!clearResponse.ok) {
            throw new Error(`Google Sheets API error: ${clearResponse.statusText}`);
          }
          
          enviornment.setOutput("Cleared Range", range);
          enviornment.log.info(`Cleared range ${range}`);
          break;
          
        default:
          enviornment.log.error(`Unknown action: ${action}`);
          return false;
      }

      enviornment.setOutput("Spreadsheet ID", spreadsheetId);
      enviornment.log.info(`Google Sheets ${action} executed successfully`);
      return true;
      
    } catch (apiError: any) {
      enviornment.log.error(`Google Sheets operation failed: ${apiError.message}`);
      return false;
    }
    
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}