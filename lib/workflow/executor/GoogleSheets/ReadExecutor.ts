import { ExecutionEnviornment } from "@/lib/types";
import { GoogleSheetsTask } from "../../task/GoogleSheets";
import { getCredentialValue } from "@/lib/credential-helper";

export async function ReadExecutor(
  enviornment: ExecutionEnviornment<typeof GoogleSheetsTask>
): Promise<boolean> {
  try {
    const spreadsheetId = enviornment.getInput("Spreadsheet ID");
    const sheetName = enviornment.getInput("Sheet Name");
    const rangeInput = enviornment.getInput("Range");
    const credentialId = enviornment.getInput("Credentials");

    if (!spreadsheetId) {
      enviornment.log.error("Spreadsheet ID is required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("Google Sheets credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.access_token) {
      enviornment.log.error("Invalid Google Sheets credentials");
      return false;
    }

    const range = sheetName ? `${sheetName}!${rangeInput || 'A1:Z100'}` : (rangeInput || "A1:Z100");
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
    const encodedRange = encodeURIComponent(range);
    const apiUrl = `${baseUrl}/values/${encodedRange}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Try fallback without sheet name if it fails
      if (sheetName && response.status === 400) {
        const fallbackRange = rangeInput || "A1:Z100";
        const fallbackUrl = `${baseUrl}/values/${encodeURIComponent(fallbackRange)}`;
        
        const fallbackResponse = await fetch(fallbackUrl, {
          headers: {
            'Authorization': `Bearer ${credentials.access_token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          enviornment.setOutput("Data", JSON.stringify(fallbackData.values || []));
          enviornment.setOutput("Range", fallbackData.range || fallbackRange);
          enviornment.log.info(`Read ${fallbackData.values?.length || 0} rows from default sheet`);
          return true;
        }
      }
      
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    const data = await response.json();
    enviornment.setOutput("Data", JSON.stringify(data.values || []));
    enviornment.setOutput("Range", data.range || range);
    enviornment.setOutput("Spreadsheet ID", spreadsheetId);
    enviornment.log.info(`Read ${data.values?.length || 0} rows from ${range}`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}