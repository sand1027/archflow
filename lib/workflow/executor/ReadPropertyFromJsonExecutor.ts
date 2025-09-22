import { ExecutionEnviornment } from "@/lib/types";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJson";
import { extractJsonPath } from "@/lib/utils/json-path";

export async function ReadPropertyFromJsonExecutor(
  enviornment: ExecutionEnviornment<typeof ReadPropertyFromJsonTask>
): Promise<boolean> {
  try {
    let jsonData = enviornment.getInput("JSON");
    enviornment.log.info(`JSON input received`);
    
    if (!jsonData) {
      enviornment.log.error("input -> JSON is not defined");
      return false;
    }
    
    const propertyName = enviornment.getInput("Property name");
    enviornment.log.info(`Property name: ${propertyName}`);

    if (!propertyName) {
      enviornment.log.error("input -> Property is not defined");
      return false;
    }
    
    const json = JSON.parse(jsonData);
    enviornment.log.info(`Parsed JSON successfully`);

    const propertyValue = extractJsonPath(json, propertyName);
    enviornment.log.info(`Extracted property value using path: ${propertyName}`);

    if (propertyValue === undefined) {
      enviornment.log.error(`Property '${propertyName}' not found in JSON`);
      return false;
    }

    // Convert arrays and objects to JSON strings for output
    const outputValue = typeof propertyValue === 'object' 
      ? JSON.stringify(propertyValue) 
      : String(propertyValue);
    
    enviornment.setOutput("Property Value", outputValue);
    enviornment.log.info(`Output set successfully`);

    return true;
  } catch (error: any) {
    enviornment.log.error(`ReadPropertyFromJson error: ${error.message}`);
    return false;
  }
}
