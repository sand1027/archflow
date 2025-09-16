export function serializeForClient(obj: any): any {
  if (!obj) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(serializeForClient);
  }
  
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    // Handle MongoDB ObjectId
    if (obj.constructor && obj.constructor.name === 'ObjectId') {
      return obj.toString();
    }
    
    const serialized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        serialized[key] = serializeForClient(value);
      }
    }
    return serialized;
  }
  
  return obj;
}