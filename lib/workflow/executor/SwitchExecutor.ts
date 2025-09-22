import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";

export async function SwitchExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.SWITCH }>
): Promise<boolean> {
  try {
    const inputValue = enviornment.getInput("Input Value");
    
    if (!inputValue) {
      enviornment.log.error("Input Value is required");
      return false;
    }

    const case1 = enviornment.getInput("Case 1");
    const case2 = enviornment.getInput("Case 2");
    const case3 = enviornment.getInput("Case 3");

    enviornment.log.info(`Switch evaluating: ${inputValue}`);

    let matched = false;

    if (case1 && inputValue === case1) {
      enviornment.setOutput("Case 1 Match", inputValue);
      enviornment.log.info(`Matched Case 1: ${case1}`);
      matched = true;
    } else if (case2 && inputValue === case2) {
      enviornment.setOutput("Case 2 Match", inputValue);
      enviornment.log.info(`Matched Case 2: ${case2}`);
      matched = true;
    } else if (case3 && inputValue === case3) {
      enviornment.setOutput("Case 3 Match", inputValue);
      enviornment.log.info(`Matched Case 3: ${case3}`);
      matched = true;
    }

    if (!matched) {
      enviornment.setOutput("Default", inputValue);
      enviornment.log.info("No cases matched, using default");
    }

    return true;
  } catch (error: any) {
    enviornment.log.error(`Switch error: ${error.message}`);
    return false;
  }
}