import { TaskType, WorkflowTask } from "@/lib/types";
import { StartTask } from "./Start";
import { WebhookTask } from "./Webhook";
import { ScheduleTriggerTask } from "./ScheduleTrigger";
import { ManualTriggerTask } from "./ManualTrigger";
import { GoogleSheetsTask } from "./GoogleSheets";
import { GoogleDocsTask } from "./GoogleDocs";
import { GoogleDriveTask } from "./GoogleDrive";
import { GoogleCalendarTask } from "./GoogleCalendar";
import { SlackTask } from "./Slack";
import { HttpRequestTask } from "./HttpRequest";
import { OpenAITask } from "./OpenAI";
import { AnthropicTask } from "./Anthropic";
import { HuggingFaceTask } from "./HuggingFace";
import { DiscordTask } from "./Discord";
import { GmailTask } from "./Gmail";
import { ConditionTask } from "./Condition";
import { NotionTask } from "./Notion";
import { DeliverViaWebHookTask } from "./DeliverViaWebHook";
import { ReadPropertyFromJsonTask } from "./ReadPropertyFromJson";
import { AddPropertyToJsonTask } from "./AddPropertyToJson";
import { SetVariableTask } from "./SetVariable";
import { CodeTask } from "./Code";
import { WaitTask } from "./Wait";
import { SwitchTask } from "./Switch";
import { ItemListsTask } from "./ItemLists";
import { MongoDBTask } from "./MongoDB";
import { MySQLTask } from "./MySQL";
import { PostgreSQLTask } from "./PostgreSQL";
import { AWSS3Task } from "./AWSS3";
import { DropboxTask } from "./Dropbox";
import { OneDriveTask } from "./OneDrive";

type Registry = {
  [key in TaskType]: WorkflowTask & { type: key };
};

export const TaskRegistry = {
  // Core nodes
  START: StartTask,
  WEBHOOK: WebhookTask,
  SCHEDULE_TRIGGER: ScheduleTriggerTask,
  MANUAL_TRIGGER: ManualTriggerTask,
  
  // Google Workspace
  GOOGLE_SHEETS: GoogleSheetsTask,
  GOOGLE_DOCS: GoogleDocsTask,
  GOOGLE_DRIVE: GoogleDriveTask,
  GOOGLE_CALENDAR: GoogleCalendarTask,
  GMAIL: GmailTask,
  
  // Communication
  SLACK: SlackTask,
  DISCORD: DiscordTask,
  TELEGRAM: DiscordTask,
  EMAIL: GmailTask,
  SMS: HttpRequestTask,
  
  // Social Media
  TWITTER: HttpRequestTask,
  LINKEDIN: HttpRequestTask,
  FACEBOOK: HttpRequestTask,
  INSTAGRAM: HttpRequestTask,
  
  // Development
  GITHUB: HttpRequestTask,
  GITLAB: HttpRequestTask,
  JIRA: HttpRequestTask,
  TRELLO: HttpRequestTask,
  
  // Data Processing
  HTTP_REQUEST: HttpRequestTask,
  JSON_PROCESSOR: ReadPropertyFromJsonTask,
  CSV_PROCESSOR: HttpRequestTask,
  TEXT_PROCESSOR: HttpRequestTask,
  DATE_TIME: HttpRequestTask,
  
  // AI & ML
  OPENAI: OpenAITask,
  ANTHROPIC: AnthropicTask,
  HUGGING_FACE: HuggingFaceTask,
  
  // Database
  MONGODB: MongoDBTask,
  MYSQL: MySQLTask,
  POSTGRESQL: PostgreSQLTask,
  REDIS: HttpRequestTask,
  
  // Cloud Storage
  AWS_S3: AWSS3Task,
  DROPBOX: DropboxTask,
  ONEDRIVE: OneDriveTask,
  
  // E-commerce
  SHOPIFY: HttpRequestTask,
  STRIPE: HttpRequestTask,
  PAYPAL: HttpRequestTask,
  
  // Productivity
  NOTION: NotionTask,
  AIRTABLE: HttpRequestTask,
  TODOIST: HttpRequestTask,
  ASANA: HttpRequestTask,
  
  // Utilities
  DELAY: StartTask,
  CONDITION: ConditionTask,
  LOOP: ConditionTask,
  MERGE: AddPropertyToJsonTask,
  SPLIT: ReadPropertyFromJsonTask,
  FILTER: ConditionTask,
  SORT: HttpRequestTask,
  SET_VARIABLE: SetVariableTask,
  CODE: CodeTask,
  WAIT: WaitTask,
  SWITCH: SwitchTask,
  ITEM_LISTS: ItemListsTask,
  
  // Legacy
  DELIVER_VIA_WEBHOOK: DeliverViaWebHookTask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
};
