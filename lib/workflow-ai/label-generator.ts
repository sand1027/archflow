import { TaskType } from "../types";

export class LabelGenerator {
  generateTriggerLabel(words: string[]): string {
    if (words.some(w => ['daily'].includes(w))) {
      return 'Daily Trigger';
    }
    if (words.some(w => ['hourly'].includes(w))) {
      return 'Hourly Trigger';
    }
    if (words.some(w => ['weekly'].includes(w))) {
      return 'Weekly Trigger';
    }
    if (words.some(w => ['schedule', 'scheduled'].includes(w))) {
      return 'Scheduled Trigger';
    }
    if (words.some(w => ['webhook', 'trigger'].includes(w))) {
      return 'Webhook Trigger';
    }
    return 'Manual Start';
  }

  generateSourceLabel(type: TaskType, words: string[]): string {
    const action = this.detectAction(words, ['read', 'get', 'fetch', 'retrieve', 'load', 'query', 'find', 'search']);
    
    const baseLabels: Record<string, string> = {
      [TaskType.HTTP_REQUEST]: words.some(w => ['website', 'web'].includes(w)) ? 'Website' : 'API',
      [TaskType.GOOGLE_SHEETS]: 'Sheets',
      [TaskType.GMAIL]: 'Email',
      [TaskType.MONGODB]: 'MongoDB',
      [TaskType.MYSQL]: 'MySQL',
      [TaskType.POSTGRESQL]: 'PostgreSQL',
      [TaskType.REDIS]: 'Redis',
      [TaskType.GOOGLE_DRIVE]: 'Drive Files',
      [TaskType.GOOGLE_CALENDAR]: 'Calendar Events',
      [TaskType.SLACK]: 'Slack Messages',
      [TaskType.DISCORD]: 'Discord Messages',
      [TaskType.NOTION]: 'Notion Pages',
      [TaskType.AIRTABLE]: 'Airtable Records',
      [TaskType.TRELLO]: 'Trello Cards',
      [TaskType.GITHUB]: 'GitHub Data',
      [TaskType.GITLAB]: 'GitLab Data',
      [TaskType.JIRA]: 'Jira Issues'
    };
    
    const baseLabel = baseLabels[type] || 'Data';
    return `${action} ${baseLabel}`;
  }

  generateProcessingLabel(type: TaskType, words: string[]): string {
    const action = this.detectAction(words, ['process', 'transform', 'extract', 'parse', 'analyze', 'filter', 'sort', 'merge', 'split']);
    
    const contextLabels: Record<string, string> = {
      [TaskType.CODE]: words.some(w => ['extract', 'parse'].includes(w)) ? 'Extract Data' : 'Process Code',
      [TaskType.OPENAI]: words.some(w => ['summary', 'summarize'].includes(w)) ? 'AI Summary' : 
                        words.some(w => ['translate'].includes(w)) ? 'AI Translation' : 
                        words.some(w => ['analyze'].includes(w)) ? 'AI Analysis' : 'AI Processing',
      [TaskType.ANTHROPIC]: words.some(w => ['chat', 'conversation'].includes(w)) ? 'Claude Chat' : 'Claude AI',
      [TaskType.HUGGING_FACE]: 'Hugging Face AI',
      [TaskType.CONDITION]: words.some(w => ['filter'].includes(w)) ? 'Filter Data' : 'Check Condition',
      [TaskType.SWITCH]: 'Route Data',
      [TaskType.WAIT]: 'Wait/Delay',
      [TaskType.DELAY]: 'Add Delay',
      [TaskType.SET_VARIABLE]: 'Set Variable',
      [TaskType.MERGE]: 'Merge Data',
      [TaskType.SPLIT]: 'Split Data',
      [TaskType.FILTER]: 'Filter Items',
      [TaskType.SORT]: 'Sort Data',
      [TaskType.LOOP]: 'Loop Through Items',
      [TaskType.JSON_PROCESSOR]: 'Process JSON',
      [TaskType.CSV_PROCESSOR]: 'Process CSV',
      [TaskType.TEXT_PROCESSOR]: 'Process Text',
      [TaskType.DATE_TIME]: 'Date/Time Operations'
    };
    
    return contextLabels[type] || `${action} Data`;
  }

  generateDestinationLabel(type: TaskType, words: string[]): string {
    const action = this.detectAction(words, ['save', 'write', 'insert', 'update', 'create', 'add', 'send', 'post', 'upload', 'store', 'append', 'reply', 'notify', 'alert']);
    
    const baseLabels: Record<string, string> = {
      [TaskType.MONGODB]: 'MongoDB',
      [TaskType.MYSQL]: 'MySQL', 
      [TaskType.POSTGRESQL]: 'PostgreSQL',
      [TaskType.REDIS]: 'Redis',
      [TaskType.GOOGLE_SHEETS]: 'Sheets',
      [TaskType.GMAIL]: 'Email',
      [TaskType.EMAIL]: 'Email',
      [TaskType.SMS]: 'SMS',
      [TaskType.SLACK]: 'Slack',
      [TaskType.DISCORD]: 'Discord',
      [TaskType.TELEGRAM]: 'Telegram',
      [TaskType.GOOGLE_DRIVE]: 'Drive',
      [TaskType.GOOGLE_CALENDAR]: 'Calendar',
      [TaskType.NOTION]: 'Notion',
      [TaskType.AIRTABLE]: 'Airtable',
      [TaskType.TRELLO]: 'Trello',
      [TaskType.JIRA]: 'Jira',
      [TaskType.GITHUB]: 'GitHub',
      [TaskType.GITLAB]: 'GitLab',
      [TaskType.DELIVER_VIA_WEBHOOK]: 'Webhook',
      [TaskType.AWS_S3]: 'S3',
      [TaskType.DROPBOX]: 'Dropbox',
      [TaskType.ONEDRIVE]: 'OneDrive',
      [TaskType.SHOPIFY]: 'Shopify',
      [TaskType.STRIPE]: 'Stripe',
      [TaskType.PAYPAL]: 'PayPal',
      [TaskType.TWITTER]: 'Twitter',
      [TaskType.LINKEDIN]: 'LinkedIn',
      [TaskType.FACEBOOK]: 'Facebook',
      [TaskType.INSTAGRAM]: 'Instagram'
    };
    
    const baseLabel = baseLabels[type] || 'Data';
    return `${action} ${baseLabel}`;
  }

  generateNodeLabel(nodeType: TaskType, words: string[]): string {
    return nodeType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  generateDynamicTitle(words: string[]): string {
    const sourceAction = this.detectAction(words, ['read', 'get', 'fetch', 'retrieve']);
    const destAction = this.detectAction(words, ['save', 'write', 'insert', 'update', 'send']);
    const source = words.find(w => ['website', 'api', 'sheets', 'email', 'database', 'mongo', 'mysql'].includes(w)) || 'data';
    const dest = words.find(w => ['mongo', 'mysql', 'postgres', 'sheets', 'slack', 'email'].includes(w)) || 'database';
    
    if (sourceAction && destAction) {
      return `${sourceAction.charAt(0).toUpperCase() + sourceAction.slice(1)} from ${source} and ${destAction} to ${dest}`;
    }
    return `${source.charAt(0).toUpperCase() + source.slice(1)} to ${dest.charAt(0).toUpperCase() + dest.slice(1)}`;
  }

  private detectAction(words: string[], actionWords: string[]): string {
    const foundAction = words.find(w => actionWords.includes(w.toLowerCase()));
    if (foundAction) {
      return foundAction.charAt(0).toUpperCase() + foundAction.slice(1);
    }
    return actionWords[0].charAt(0).toUpperCase() + actionWords[0].slice(1);
  }
}