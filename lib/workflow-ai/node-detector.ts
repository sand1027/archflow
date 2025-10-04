import { TaskType } from "../types";

export class NodeDetector {
  detectTriggerType(words: string[]): TaskType {
    const scheduleKeywords = ['schedule', 'scheduled', 'daily', 'hourly', 'weekly', 'monthly', 'cron', 'timer', 'automatic', 'auto', 'recurring', 'repeat', 'interval', 'periodic', 'every'];
    const webhookKeywords = ['webhook', 'trigger', 'event', 'callback', 'http', 'post', 'receive', 'incoming'];
    
    if (words.some(w => scheduleKeywords.includes(w))) {
      return TaskType.SCHEDULE_TRIGGER;
    }
    if (words.some(w => webhookKeywords.includes(w))) {
      return TaskType.WEBHOOK;
    }
    return TaskType.MANUAL_TRIGGER;
  }

  detectSourceType(words: string[]): TaskType | null {
    const readActions = ['read', 'get', 'fetch', 'retrieve', 'load', 'from', 'in', 'check', 'find', 'search', 'query'];
    
    const detectors = [
      { keywords: ['mongo', 'mongodb', 'database', 'db', 'collection', 'document', 'nosql'], type: TaskType.MONGODB },
      { keywords: ['mysql', 'sql', 'database', 'table', 'query', 'select'], type: TaskType.MYSQL },
      { keywords: ['postgres', 'postgresql', 'psql', 'database', 'table'], type: TaskType.POSTGRESQL },
      { keywords: ['sheets', 'spreadsheet', 'google', 'excel', 'csv', 'rows', 'columns'], type: TaskType.GOOGLE_SHEETS },
      { keywords: ['gmail', 'email', 'mail', 'inbox', 'messages'], type: TaskType.GMAIL },
      { keywords: ['drive', 'gdrive', 'files', 'folder', 'upload', 'download'], type: TaskType.GOOGLE_DRIVE },
      { keywords: ['calendar', 'events', 'meetings', 'appointments', 'schedule'], type: TaskType.GOOGLE_CALENDAR },
      { keywords: ['slack', 'channel', 'message', 'chat', 'team'], type: TaskType.SLACK },
      { keywords: ['notion', 'page', 'database', 'block', 'workspace'], type: TaskType.NOTION },
      { keywords: ['website', 'web', 'scrape', 'html', 'page', 'site', 'url', 'crawl'], type: TaskType.HTTP_REQUEST },
      { keywords: ['api', 'endpoint', 'rest', 'json', 'http', 'get', 'post', 'fetch'], type: TaskType.HTTP_REQUEST }
    ];

    for (const detector of detectors) {
      if (words.some(w => detector.keywords.includes(w)) && 
          (detector.type === TaskType.HTTP_REQUEST || words.some(w => readActions.includes(w)))) {
        return detector.type;
      }
    }
    return null;
  }

  detectProcessingType(words: string[]): TaskType | null {
    const detectors = [
      { keywords: ['ai', 'openai', 'gpt', 'analyze', 'summarize', 'generate', 'translate', 'classify', 'sentiment', 'nlp', 'machine', 'learning', 'intelligent'], type: TaskType.OPENAI },
      { keywords: ['anthropic', 'claude', 'ai', 'analyze', 'chat', 'conversation'], type: TaskType.ANTHROPIC },
      { keywords: ['extract', 'parse', 'process', 'transform', 'code', 'script', 'javascript', 'python', 'function', 'calculate', 'compute', 'format', 'clean', 'manipulate'], type: TaskType.CODE },
      { keywords: ['condition', 'if', 'check', 'filter', 'validate', 'compare', 'match', 'test', 'verify', 'when', 'where', 'case'], type: TaskType.CONDITION },
      { keywords: ['switch', 'route', 'branch', 'multiple', 'options', 'choose', 'select'], type: TaskType.SWITCH },
      { keywords: ['wait', 'delay', 'pause', 'sleep', 'timeout', 'interval'], type: TaskType.WAIT },
      { keywords: ['variable', 'set', 'store', 'save', 'assign', 'value', 'data'], type: TaskType.SET_VARIABLE }
    ];

    for (const detector of detectors) {
      if (words.some(w => detector.keywords.includes(w))) {
        return detector.type;
      }
    }
    return null;
  }

  detectDestinationType(words: string[]): TaskType | null {
    const writeActions = ['send', 'save', 'store', 'insert', 'update', 'write', 'append', 'create', 'add', 'post', 'upload', 'deliver', 'notify', 'alert', 'to'];
    
    const detectors = [
      { keywords: ['gmail', 'email', 'mail', 'send', 'message', 'notify'], type: TaskType.GMAIL },
      { keywords: ['slack', 'channel', 'message', 'chat', 'team', 'notification', 'notify', 'alert'], type: TaskType.SLACK },
      { keywords: ['discord', 'server', 'channel', 'bot', 'message', 'notify'], type: TaskType.DISCORD },
      { keywords: ['mongo', 'mongodb', 'database', 'db', 'collection', 'document', 'nosql'], type: TaskType.MONGODB },
      { keywords: ['mysql', 'sql', 'database', 'table', 'insert', 'update'], type: TaskType.MYSQL },
      { keywords: ['postgres', 'postgresql', 'psql', 'database', 'table'], type: TaskType.POSTGRESQL },
      { keywords: ['sheets', 'spreadsheet', 'google', 'excel', 'csv', 'rows', 'columns'], type: TaskType.GOOGLE_SHEETS },
      { keywords: ['drive', 'gdrive', 'files', 'folder', 'upload', 'save'], type: TaskType.GOOGLE_DRIVE },
      { keywords: ['calendar', 'events', 'meetings', 'appointments', 'create', 'schedule'], type: TaskType.GOOGLE_CALENDAR },
      { keywords: ['notion', 'page', 'database', 'block', 'workspace', 'create', 'update'], type: TaskType.NOTION },
      { keywords: ['webhook', 'deliver', 'send', 'post', 'callback', 'trigger'], type: TaskType.DELIVER_VIA_WEBHOOK },
      { keywords: ['s3', 'aws', 'bucket', 'storage', 'upload', 'save', 'file'], type: TaskType.AWS_S3 },
      { keywords: ['dropbox', 'storage', 'upload', 'save', 'file', 'sync'], type: TaskType.DROPBOX }
    ];

    for (const detector of detectors) {
      if (words.some(w => detector.keywords.includes(w)) && 
          (detector.type === TaskType.DELIVER_VIA_WEBHOOK || words.some(w => writeActions.includes(w)))) {
        return detector.type;
      }
    }
    return null;
  }
}