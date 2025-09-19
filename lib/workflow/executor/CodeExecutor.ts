import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";

export async function CodeExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.CODE }>
): Promise<boolean> {
  try {
    const code = enviornment.getInput("JavaScript Code");
    const inputData = enviornment.getInput("Input Data");

    if (!code) {
      enviornment.log.error("JavaScript Code is required");
      return false;
    }

    enviornment.log.info("Executing JavaScript code");

    // Create a safe execution context
    let parsedInputData = null;
    if (inputData) {
      try {
        // Try to parse as JSON if it's a string
        parsedInputData = typeof inputData === 'string' ? JSON.parse(inputData) : inputData;
      } catch (e) {
        // If parsing fails, use as string
        parsedInputData = inputData;
      }
    }
    
    const context = {
      inputData: parsedInputData,
      console: {
        log: (msg: any) => enviornment.log.info(String(msg)),
        error: (msg: any) => enviornment.log.error(String(msg)),
      },
    };

    // Execute the code in a function context
    const func = new Function('inputData', 'console', code);
    const result = func(context.inputData, context.console);

    const output = typeof result === 'object' ? JSON.stringify(result) : String(result);
    enviornment.setOutput("Result", output);

    enviornment.log.info("Code executed successfully");
    return true;
  } catch (error: any) {
    enviornment.log.error(`Code execution error: ${error.message}`);
    return false;
  }
}