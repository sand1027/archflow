import { ExecutionEnviornment } from "@/lib/types";
import { HttpRequestTask } from "../../task/HttpRequest";

export async function RequestExecutor(
  enviornment: ExecutionEnviornment<typeof HttpRequestTask>
): Promise<boolean> {
  try {
    const method = enviornment.getInput("Method");
    const url = enviornment.getInput("URL");
    const headersStr = enviornment.getInput("Headers");
    const body = enviornment.getInput("Body");

    if (!method || !url) {
      enviornment.log.error("Method and URL are required");
      return false;
    }

    let headers: Record<string, string> = {};
    if (headersStr) {
      try {
        headers = JSON.parse(headersStr);
      } catch (e) {
        enviornment.log.error("Invalid headers JSON format");
        return false;
      }
    }

    const requestOptions: RequestInit = {
      method,
      headers: {
        ...headers,
      },
      signal: AbortSignal.timeout(30000),
    };

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (body) {
        requestOptions.headers = {
          'Content-Type': 'application/json',
          ...requestOptions.headers,
        };
        requestOptions.body = body;
      }
    }

    const response = await fetch(url, requestOptions);
    const responseText = await response.text();
    
    enviornment.setOutput("Response Body", responseText);
    enviornment.setOutput("Status Code", response.status.toString());
    enviornment.setOutput("Headers", JSON.stringify(Object.fromEntries(response.headers.entries())));
    enviornment.log.info(`Request completed with status ${response.status}`);
    
    return response.ok;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}