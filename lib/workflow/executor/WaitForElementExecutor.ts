import { ExecutionEnviornment } from "@/lib/types";
import { WaitForElementTask } from "../task/WaitForElement";

export async function WaitForElementExecutor(
  enviornment: ExecutionEnviornment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    const selector = enviornment.getInput("Selector");
    if (!selector) {
      enviornment.log.error("input -> selector is not defined");
      return false;
    }
    const visibility = enviornment.getInput("Visiblity");
    if (!visibility) {
      enviornment.log.error("input -> visibility is not defined");
      return false;
    }

    if (visibility === "visible") {
      await enviornment.getPage()!.waitForSelector(selector, { state: 'visible' });
    } else if (visibility === "hidden") {
      await enviornment.getPage()!.waitForSelector(selector, { state: 'hidden' });
    } else {
      await enviornment.getPage()!.waitForSelector(selector);
    }

    enviornment.log.info(`Element ${selector} became: ${visibility}`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}
