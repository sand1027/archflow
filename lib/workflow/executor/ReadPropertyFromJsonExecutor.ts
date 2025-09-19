import { ExecutionEnviornment } from "@/lib/types";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJson";

export async function ReadPropertyFromJsonExecutor(
  enviornment: ExecutionEnviornment<typeof ReadPropertyFromJsonTask>
): Promise<boolean> {
  try {
    let jsonData = enviornment.getInput("JSON");
    enviornment.log.info(`JSON input received: ${jsonData}`);
    
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

    const propertValue = json[propertyName];
    enviornment.log.info(`Property value: ${propertValue}`);

    if (propertValue === undefined) {
      enviornment.log.error(`Property '${propertyName}' not found in JSON`);
      return false;
    }

    enviornment.setOutput("Property Value", String(propertValue));
    enviornment.log.info(`Output set successfully`);

    return true;
  } catch (error: any) {
    enviornment.log.error(`ReadPropertyFromJson error: ${error.message}`);
    return false;
  }
}
