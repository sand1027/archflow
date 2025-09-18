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
  GOOGLE_SHEETS: HttpRequestExecutor,
  GOOGLE_DOCS: HttpRequestExecutor,
  GOOGLE_DRIVE: HttpRequestExecutor,
  GOOGLE_CALENDAR: HttpRequestExecutor,
  GMAIL: HttpRequestExecutor,
  
  // Communication
  SLACK: HttpRequestExecutor,
  DISCORD: HttpRequestExecutor,
  TELEGRAM: HttpRequestExecutor,
  EMAIL: HttpRequestExecutor,
  SMS: HttpRequestExecutor,
  
  // Social Media
  TWITTER: HttpRequestExecutor,
  LINKEDIN: HttpRequestExecutor,
  FACEBOOK: HttpRequestExecutor,
  INSTAGRAM: HttpRequestExecutor,
  
  // Development
  GITHUB: HttpRequestExecutor,
  GITLAB: HttpRequestExecutor,
  JIRA: HttpRequestExecutor,
  TRELLO: HttpRequestExecutor,
  
  // Data Processing
  HTTP_REQUEST: HttpRequestExecutor,
  JSON_PROCESSOR: ReadPropertyFromJsonExecutor,
  CSV_PROCESSOR: HttpRequestExecutor,
  TEXT_PROCESSOR: HttpRequestExecutor,
  DATE_TIME: HttpRequestExecutor,
  
  // AI & ML
  OPENAI: OpenAIExecutor,
  ANTHROPIC: AnthropicExecutor,
  HUGGING_FACE: HuggingFaceExecutor,
  
  // Database
  MYSQL: HttpRequestExecutor,
  POSTGRESQL: HttpRequestExecutor,
  MONGODB: HttpRequestExecutor,
  REDIS: HttpRequestExecutor,
  
  // Cloud Storage
  AWS_S3: HttpRequestExecutor,
  DROPBOX: HttpRequestExecutor,
  ONEDRIVE: HttpRequestExecutor,
  
  // E-commerce
  SHOPIFY: HttpRequestExecutor,
  STRIPE: HttpRequestExecutor,
  PAYPAL: HttpRequestExecutor,
  
  // Productivity
  NOTION: HttpRequestExecutor,
  AIRTABLE: HttpRequestExecutor,
  TODOIST: HttpRequestExecutor,
  ASANA: HttpRequestExecutor,
  
  // Utilities
  DELAY: StartExecutor,
  CONDITION: ConditionExecutor,
  LOOP: ConditionExecutor,
  MERGE: AddPropertyToJsonExecutor,
  SPLIT: ReadPropertyFromJsonExecutor,
  FILTER: ConditionExecutor,
  SORT: HttpRequestExecutor,
  
  // Legacy
  DELIVER_VIA_WEBHOOK: DeviverViaWebHookExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
};
