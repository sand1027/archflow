import { ExecutionEnviornment } from "@/lib/types";
import { ConditionTask } from "../task/Condition";

export async function ConditionExecutor(
  enviornment: ExecutionEnviornment<typeof ConditionTask>
): Promise<boolean> {
  try {
    const value1 = enviornment.getInput("Value 1");
    const operator = enviornment.getInput("Operator");
    const value2 = enviornment.getInput("Value 2");

    if (!value1 || !operator) {
      enviornment.log.error("Value 1 and Operator are required");
      return false;
    }

    let result = false;

    switch (operator) {
      case "equals":
        result = value1 === value2;
        break;
      case "not_equals":
        result = value1 !== value2;
        break;
      case "greater_than":
        result = parseFloat(value1) > parseFloat(value2 || "0");
        break;
      case "less_than":
        result = parseFloat(value1) < parseFloat(value2 || "0");
        break;
      case "contains":
        result = value1.includes(value2 || "");
        break;
      case "starts_with":
        result = value1.startsWith(value2 || "");
        break;
      case "ends_with":
        result = value1.endsWith(value2 || "");
        break;
      case "is_empty":
        result = !value1 || value1.trim() === "";
        break;
      case "is_not_empty":
        result = !!(value1 && value1.trim() !== "");
        break;
      default:
        enviornment.log.error(`Unknown operator: ${operator}`);
        return false;
    }

    enviornment.setOutput("Result", result.toString());
    enviornment.setOutput("True", result ? "true" : "");
    enviornment.setOutput("False", result ? "" : "false");

    enviornment.log.info(`Condition evaluated to: ${result}`);
    
    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}