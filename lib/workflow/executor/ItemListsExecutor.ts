import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";

export async function ItemListsExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.ITEM_LISTS }>
): Promise<boolean> {
  try {
    const operation = enviornment.getInput("Operation");
    const inputList = enviornment.getInput("Input List");
    const sortField = enviornment.getInput("Sort Field");

    if (!operation) {
      enviornment.log.error("Operation is required");
      return false;
    }

    if (!inputList) {
      enviornment.log.error("Input List is required");
      return false;
    }

    let items: any[];
    
    // Parse input list
    try {
      items = JSON.parse(inputList);
      if (!Array.isArray(items)) {
        // Try comma-separated values
        items = inputList.split(',').map(item => item.trim());
      }
    } catch {
      // Fallback to comma-separated
      items = inputList.split(',').map(item => item.trim());
    }

    enviornment.log.info(`Processing ${items.length} items with operation: ${operation}`);

    let result: any[] = [];

    switch (operation) {
      case "split":
        result = items;
        break;
      
      case "aggregate":
        result = [items];
        break;
      
      case "unique":
        result = Array.from(new Set(items));
        break;
      
      case "sort":
        if (sortField && items.length > 0 && typeof items[0] === 'object') {
          result = [...items].sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          });
        } else {
          result = [...items].sort();
        }
        break;
      
      default:
        enviornment.log.error(`Unknown operation: ${operation}`);
        return false;
    }

    enviornment.setOutput("Output", JSON.stringify(result));
    enviornment.setOutput("Count", String(result.length));
    
    enviornment.log.info(`Operation completed. Output count: ${result.length}`);
    return true;
  } catch (error: any) {
    enviornment.log.error(`ItemLists error: ${error.message}`);
    return false;
  }
}