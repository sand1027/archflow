import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { StartExecutor } from "./StartExecutor";
import { WebhookExecutor } from "./WebhookExecutor";
import { ScheduleTriggerExecutor } from "./ScheduleTriggerExecutor";
import { ManualTriggerExecutor } from "./ManualTriggerExecutor";
import { HttpRequestExecutor } from "./HttpRequestExecutor";
import { ConditionExecutor } from "./ConditionExecutor";
import { OpenAIExecutor } from "./OpenAIExecutor";
import { AnthropicExecutor } from "./AnthropicExecutor";
import { HuggingFaceExecutor } from "./HuggingFaceExecutor";
import { DeviverViaWebHookExecutor } from "./DeliverViaWebHookExecutor";
import { ReadPropertyFromJsonExecutor } from "./ReadPropertyFromJsonExecutor";
import { AddPropertyToJsonExecutor } from "./AddPropertyToJsonExecutor ";
import { SlackExecutor } from "./SlackExecutor";
import { NotionExecutor } from "./NotionExecutor";
import { GmailExecutor } from "./GmailExecutor";
import { GoogleSheetsExecutor } from "./GoogleSheetsExecutor";
import { GoogleDocsExecutor } from "./GoogleDocsExecutor";
import { GoogleDriveExecutor } from "./GoogleDriveExecutor";
import { GoogleCalendarExecutor } from "./GoogleCalendarExecutor";
import { SetVariableExecutor } from "./SetVariableExecutor";
import { CodeExecutor } from "./CodeExecutor";
import { WaitExecutor } from "./WaitExecutor";
import { SwitchExecutor } from "./SwitchExecutor";
import { ItemListsExecutor } from "./ItemListsExecutor";
import { MongoDBExecutor } from "./MongoDBExecutor";
import { MySQLExecutor } from "./MySQLExecutor";
import { PostgreSQLExecutor } from "./PostgreSQLExecutor";
import { AWSS3Executor } from "./AWSS3Executor";
import { DropboxExecutor } from "./DropboxExecutor";
import { OneDriveExecutor } from "./OneDriveExecutor";
import { MicrosoftTeamsExecutor } from "./MicrosoftTeamsExecutor";
import { WhatsAppExecutor } from "./WhatsAppExecutor";
import { AIWorkflowBuilderExecutor } from "./AIWorkflowBuilderExecutor";
import { StudyTimerExecutor } from "./StudyTimerExecutor";
import { CitationGeneratorExecutor } from "./CitationGeneratorExecutor";

type ExecutorFunction<T extends WorkflowTask> = (
  enviornment: ExecutionEnviornment<T>
) => Promise<boolean>;

type RegistryType = {
  [key in TaskType]: ExecutorFunction<WorkflowTask & { type: key }>;
};

export const ExecutorRegistry: RegistryType = {
  // Core nodes
  START: StartExecutor,
  WEBHOOK: WebhookExecutor,
  SCHEDULE_TRIGGER: ScheduleTriggerExecutor,
  MANUAL_TRIGGER: ManualTriggerExecutor,
  
  // Google Workspace
  GOOGLE_SHEETS: GoogleSheetsExecutor,
  GOOGLE_DOCS: GoogleDocsExecutor,
  GOOGLE_DRIVE: GoogleDriveExecutor,
  GOOGLE_CALENDAR: GoogleCalendarExecutor,
  GMAIL: GmailExecutor,
  
  // Communication
  SLACK: SlackExecutor,
  DISCORD: HttpRequestExecutor as any,
  TELEGRAM: HttpRequestExecutor as any,
  EMAIL: HttpRequestExecutor as any,
  SMS: HttpRequestExecutor as any,
  MICROSOFT_TEAMS: MicrosoftTeamsExecutor,
  WHATSAPP: WhatsAppExecutor,
  
  // Social Media
  TWITTER: HttpRequestExecutor as any,
  LINKEDIN: HttpRequestExecutor as any,
  FACEBOOK: HttpRequestExecutor as any,
  INSTAGRAM: HttpRequestExecutor as any,
  
  // Development
  GITHUB: HttpRequestExecutor as any,
  GITLAB: HttpRequestExecutor as any,
  JIRA: HttpRequestExecutor as any,
  TRELLO: HttpRequestExecutor as any,
  
  // Data Processing
  HTTP_REQUEST: HttpRequestExecutor,
  JSON_PROCESSOR: ReadPropertyFromJsonExecutor as any,
  CSV_PROCESSOR: HttpRequestExecutor as any,
  TEXT_PROCESSOR: HttpRequestExecutor as any,
  DATE_TIME: HttpRequestExecutor as any,
  
  // AI & ML
  OPENAI: OpenAIExecutor,
  ANTHROPIC: AnthropicExecutor,
  HUGGING_FACE: HuggingFaceExecutor,
  AI_WORKFLOW_BUILDER: AIWorkflowBuilderExecutor,
  SMART_NODE_SUGGESTIONS: HttpRequestExecutor as any,
  AI_DATA_TRANSFORMER: HttpRequestExecutor as any,
  
  // Database
  MONGODB: MongoDBExecutor,
  MYSQL: MySQLExecutor,
  POSTGRESQL: PostgreSQLExecutor,
  REDIS: HttpRequestExecutor as any,
  
  // Cloud Storage
  AWS_S3: AWSS3Executor,
  DROPBOX: DropboxExecutor,
  ONEDRIVE: OneDriveExecutor,
  
  // E-commerce
  SHOPIFY: HttpRequestExecutor as any,
  STRIPE: HttpRequestExecutor as any,
  PAYPAL: HttpRequestExecutor as any,
  
  // Productivity
  NOTION: NotionExecutor,
  AIRTABLE: HttpRequestExecutor as any,
  TODOIST: HttpRequestExecutor as any,
  ASANA: HttpRequestExecutor as any,
  ZAPIER_IMPORT: HttpRequestExecutor as any,
  
  // Education
  CANVAS_LMS: HttpRequestExecutor as any,
  BLACKBOARD: HttpRequestExecutor as any,
  COURSERA: HttpRequestExecutor as any,
  EDX: HttpRequestExecutor as any,
  CITATION_GENERATOR: CitationGeneratorExecutor,
  STUDY_TIMER: StudyTimerExecutor,
  ZOOM: HttpRequestExecutor as any,
  GOOGLE_MEET: HttpRequestExecutor as any,
  
  // Utilities
  DELAY: StartExecutor as any,
  CONDITION: ConditionExecutor,
  LOOP: ConditionExecutor as any,
  MERGE: AddPropertyToJsonExecutor as any,
  SPLIT: ReadPropertyFromJsonExecutor as any,
  FILTER: ConditionExecutor as any,
  SORT: HttpRequestExecutor as any,
  SET_VARIABLE: SetVariableExecutor,
  CODE: CodeExecutor,
  WAIT: WaitExecutor,
  SWITCH: SwitchExecutor,
  ITEM_LISTS: ItemListsExecutor,
  
  // Legacy
  DELIVER_VIA_WEBHOOK: DeviverViaWebHookExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
};
