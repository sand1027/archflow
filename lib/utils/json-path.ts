/**
 * JSON Path utility for extracting values from JSON objects
 * Supports:
 * - Simple properties: "name"
 * - Nested properties: "user.name"
 * - Array indices: "users[0].name"
 * - Array extraction: "users[*].name"
 */

export function extractJsonPath(data: any, path: string): any {
  if (!path) return data;
  
  try {
    // Handle array extraction with [*] syntax
    if (path.includes('[*]')) {
      return extractArrayPath(data, path);
    }
    
    // Handle regular path traversal
    return extractRegularPath(data, path);
  } catch (error) {
    throw new Error(`Invalid JSON path: ${path}`);
  }
}

function extractArrayPath(data: any, path: string): any[] {
  const parts = path.split('[*]');
  const beforeArray = parts[0];
  const afterArray = parts[1];
  
  // Navigate to the array
  let current = beforeArray ? extractRegularPath(data, beforeArray) : data;
  
  if (!Array.isArray(current)) {
    throw new Error(`Path ${beforeArray} does not point to an array`);
  }
  
  // Extract property from each array item
  if (afterArray && afterArray.startsWith('.')) {
    const propertyPath = afterArray.substring(1); // Remove leading dot
    return current.map(item => extractRegularPath(item, propertyPath));
  }
  
  return current;
}

function extractRegularPath(data: any, path: string): any {
  const keys = parsePath(path);
  let current = data;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    
    if (key.isArray) {
      if (!Array.isArray(current)) {
        throw new Error(`Expected array at ${key.name}`);
      }
      current = current[key.index!];
    } else {
      current = current[key.name];
    }
  }
  
  return current;
}

function parsePath(path: string): Array<{name: string, isArray: boolean, index?: number}> {
  const keys: Array<{name: string, isArray: boolean, index?: number}> = [];
  const parts = path.split('.');
  
  for (const part of parts) {
    if (part.includes('[') && part.includes(']')) {
      const match = part.match(/^([^[]+)\[(\d+)\]$/);
      if (match) {
        keys.push({ name: match[1], isArray: true, index: parseInt(match[2]) });
      } else {
        throw new Error(`Invalid array syntax: ${part}`);
      }
    } else {
      keys.push({ name: part, isArray: false });
    }
  }
  
  return keys;
}