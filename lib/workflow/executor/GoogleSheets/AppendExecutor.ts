import { ExecutionEnviornment } from "@/lib/types";
import { GoogleSheetsTask } from "../../task/GoogleSheets";
import { getCredentialValue } from "@/lib/credential-helper";

export async function AppendExecutor(
  enviornment: ExecutionEnviornment<typeof GoogleSheetsTask>
): Promise<boolean> {
  try {
    const spreadsheetId = enviornment.getInput("Spreadsheet ID");
    const sheetName = enviornment.getInput("Sheet Name");
    const rangeInput = enviornment.getInput("Range");
    const data = enviornment.getInput("Data");
    const credentialId = enviornment.getInput("Credentials");

    if (!spreadsheetId || !data) {
      enviornment.log.error("Spreadsheet ID and Data are required");
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

    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = [[data]];
    }

    if (!Array.isArray(parsedData)) {
      enviornment.log.error("Data must be an array");
      return false;
    }

    const range = sheetName ? `${sheetName}!${rangeInput || 'A1'}` : (rangeInput || "A1");
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
    const appendUrl = `${baseUrl}/values/${range}:append?valueInputOption=RAW`;

    const response = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: parsedData }),
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    const result = await response.json();
    enviornment.setOutput("Updated Range", result.updates?.updatedRange || range);
    enviornment.setOutput("Updated Rows", String(result.updates?.updatedRows || 0));
    enviornment.setOutput("Spreadsheet ID", spreadsheetId);
    enviornment.log.info(`Append completed: ${result.updates?.updatedRows || 0} rows added`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}