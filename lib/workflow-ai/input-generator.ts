import { TaskType } from "../types";

export class InputGenerator {
  generateTriggerInputs(words: string[]): Record<string, string> {
    if (words.some(w => ['daily'].includes(w))) {
      return { 'Cron Expression': '0 9 * * *', 'Timezone': 'UTC' };
    }
    if (words.some(w => ['hourly'].includes(w))) {
      return { 'Cron Expression': '0 * * * *', 'Timezone': 'UTC' };
    }
    return {};
  }

  generateSourceInputs(type: TaskType, words: string[], prompt: string): Record<string, string> {
    switch (type) {
      case TaskType.HTTP_REQUEST:
        const url = this.extractUrl(prompt) || 'https://example.com';
        return {
          'Method': 'GET',
          'URL': url,
          'Headers': '{"User-Agent": "Mozilla/5.0"}'
        };
      case TaskType.GOOGLE_SHEETS:
        return {
          'Action': 'read',
          'Spreadsheet ID': 'your-spreadsheet-id',
          'Range': 'A1:Z1000'
        };
      case TaskType.MONGODB:
        const collection = this.extractCollection(words) || 'users';
        return {
          'Action': 'find',
          'Collection': collection,
          'Query': '{}'
        };
      case TaskType.MYSQL:
      case TaskType.POSTGRESQL:
        return {
          'Action': 'query',
          'Query': 'SELECT * FROM users'
        };
      default:
        return {};
    }
  }

  generateProcessingInputs(type: TaskType, words: string[], prompt: string): Record<string, string> {
    switch (type) {
      case TaskType.CODE:
        return {
          'Language': 'javascript',
          'Code': '// Extract data\nconst data = { extracted: "value" };\nreturn data;'
        };
      case TaskType.OPENAI:
        return {
          'Model': 'gpt-3.5-turbo',
          'Prompt': `Process this data: {{PreviousNode.Output}}`,
          'Max Tokens': '300'
        };
      default:
        return {};
    }
  }

  generateDestinationInputs(type: TaskType, words: string[], prompt: string): Record<string, string> {
    switch (type) {
      case TaskType.GMAIL:
        return {
          'Action': 'send',
          'To': '{{PreviousNode.Email}}',
          'Subject': 'Notification',
          'Body': 'Hello {{PreviousNode.Name}}, this is an automated message.'
        };
      case TaskType.SLACK:
        return {
          'Action': 'send',
          'Channel': '#general',
          'Message': '{{PreviousNode.Output}}'
        };
      case TaskType.MONGODB:
        const collection = this.extractCollection(words) || 'data';
        return {
          'Action': 'insert',
          'Collection': collection,
          'Document': '{{PreviousNode.Output}}'
        };
      case TaskType.GOOGLE_SHEETS:
        return {
          'Action': 'append',
          'Spreadsheet ID': 'your-spreadsheet-id',
          'Range': 'A:Z',
          'Values': '{{PreviousNode.Output}}'
        };
      default:
        return {};
    }
  }

  private extractUrl(prompt: string): string | null {
    const urlMatch = prompt.match(/https?:\/\/[^\s]+/);
    return urlMatch ? urlMatch[0] : null;
  }

  private extractCollection(words: string[]): string | null {
    const collections = ['users', 'products', 'orders', 'data', 'items', 'records'];
    return collections.find(c => words.includes(c)) || null;
  }
}