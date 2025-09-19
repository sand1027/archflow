import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";

export async function SetVariableExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.SET_VARIABLE }>
): Promise<boolean> {
  try {
    const variableName = enviornment.getInput("Variable Name");
    const value = enviornment.getInput("Value");

    if (!variableName) {
      enviornment.log.error("Variable Name is required");
      return false;
    }

    if (!value) {
      enviornment.log.error("Value is required");
      return false;
    }

    enviornment.log.info(`Setting variable ${variableName} = ${value}`);

    enviornment.setOutput("Variable Name", variableName);
    enviornment.setOutput("Value", value);

    enviornment.log.info(`Variable ${variableName} set successfully`);
    return true;
  } catch (error: any) {
    enviornment.log.error(`SetVariable error: ${error.message}`);
    return false;
  }
}