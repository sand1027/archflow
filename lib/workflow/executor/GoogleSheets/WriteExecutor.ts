import { ExecutionEnviornment } from "@/lib/types";
import { GoogleSheetsTask } from "../../task/GoogleSheets";
import { getCredentialValue } from "@/lib/credential-helper";

export async function WriteExecutor(
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
    const writeUrl = `${baseUrl}/values/${range}?valueInputOption=RAW`;

    const response = await fetch(writeUrl, {
      method: 'PUT',
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
    enviornment.setOutput("Updated Range", result.updatedRange || range);
    enviornment.setOutput("Updated Rows", String(result.updatedRows || 0));
    enviornment.setOutput("Spreadsheet ID", spreadsheetId);
    enviornment.log.info(`Write completed: ${result.updatedRows || 0} rows updated`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}