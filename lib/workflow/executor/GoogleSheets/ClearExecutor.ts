import { ExecutionEnviornment } from "@/lib/types";
import { GoogleSheetsTask } from "../../task/GoogleSheets";
import { getCredentialValue } from "@/lib/credential-helper";

export async function ClearExecutor(
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
    const clearUrl = `${baseUrl}/values/${range}:clear`;

    const response = await fetch(clearUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    enviornment.setOutput("Cleared Range", range);
    enviornment.setOutput("Spreadsheet ID", spreadsheetId);
    enviornment.log.info(`Cleared range ${range}`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}