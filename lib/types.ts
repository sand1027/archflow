import { Node } from "@xyflow/react";
import { LucideProps } from "lucide-react";
import React from "react";

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export enum TaskType {
  // Core nodes
  START = "START",
  WEBHOOK = "WEBHOOK",
  SCHEDULE_TRIGGER = "SCHEDULE_TRIGGER",
  MANUAL_TRIGGER = "MANUAL_TRIGGER",
  
  // Google Workspace
  GOOGLE_SHEETS = "GOOGLE_SHEETS",
  GOOGLE_DOCS = "GOOGLE_DOCS",
  GOOGLE_DRIVE = "GOOGLE_DRIVE",
  GOOGLE_CALENDAR = "GOOGLE_CALENDAR",
  GMAIL = "GMAIL",
  
  // Communication
  SLACK = "SLACK",
  DISCORD = "DISCORD",
  TELEGRAM = "TELEGRAM",
  EMAIL = "EMAIL",
  SMS = "SMS",
  MICROSOFT_TEAMS = "MICROSOFT_TEAMS",
  WHATSAPP = "WHATSAPP",
  
  // Social Media
  TWITTER = "TWITTER",
  LINKEDIN = "LINKEDIN",
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
  
  // Development
  GITHUB = "GITHUB",
  GITLAB = "GITLAB",
  JIRA = "JIRA",
  TRELLO = "TRELLO",
  
  // Data Processing
  HTTP_REQUEST = "HTTP_REQUEST",
  JSON_PROCESSOR = "JSON_PROCESSOR",
  CSV_PROCESSOR = "CSV_PROCESSOR",
  TEXT_PROCESSOR = "TEXT_PROCESSOR",
  DATE_TIME = "DATE_TIME",
  
  // AI & ML
  OPENAI = "OPENAI",
  ANTHROPIC = "ANTHROPIC",
  HUGGING_FACE = "HUGGING_FACE",
  AI_WORKFLOW_BUILDER = "AI_WORKFLOW_BUILDER",
  SMART_NODE_SUGGESTIONS = "SMART_NODE_SUGGESTIONS",
  AI_DATA_TRANSFORMER = "AI_DATA_TRANSFORMER",
  
  // Database
  MYSQL = "MYSQL",
  POSTGRESQL = "POSTGRESQL",
  MONGODB = "MONGODB",
  REDIS = "REDIS",
  
  // Cloud Storage
  AWS_S3 = "AWS_S3",
  DROPBOX = "DROPBOX",
  ONEDRIVE = "ONEDRIVE",
  
  // E-commerce
  SHOPIFY = "SHOPIFY",
  STRIPE = "STRIPE",
  PAYPAL = "PAYPAL",
  
  // Productivity
  NOTION = "NOTION",
  AIRTABLE = "AIRTABLE",
  TODOIST = "TODOIST",
  ASANA = "ASANA",
  ZAPIER_IMPORT = "ZAPIER_IMPORT",
  
  // Education
  CANVAS_LMS = "CANVAS_LMS",
  BLACKBOARD = "BLACKBOARD",
  COURSERA = "COURSERA",
  EDX = "EDX",
  CITATION_GENERATOR = "CITATION_GENERATOR",
  STUDY_TIMER = "STUDY_TIMER",
  ZOOM = "ZOOM",
  GOOGLE_MEET = "GOOGLE_MEET",
  
  // Utilities
  DELAY = "DELAY",
  CONDITION = "CONDITION",
  LOOP = "LOOP",
  MERGE = "MERGE",
  SPLIT = "SPLIT",
  FILTER = "FILTER",
  SORT = "SORT",
  SET_VARIABLE = "SET_VARIABLE",
  CODE = "CODE",
  WAIT = "WAIT",
  SWITCH = "SWITCH",
  ITEM_LISTS = "ITEM_LISTS",
  
  // Legacy (keeping for compatibility)
  DELIVER_VIA_WEBHOOK = "DELIVER_VIA_WEBHOOK",
  READ_PROPERTY_FROM_JSON = "READ_PROPERTY_FROM_JSON",
  ADD_PROPERTY_TO_JSON = "ADD_PROPERTY_TO_JSON",
}
export enum TaskParamType {
  STRING = "STRING",
  TEXTAREA = "TEXTAREA",
  SELECT = "SELECT",
  CREDENTIAL = "CREDENTIAL",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  JSON = "JSON",
  FILE = "FILE",
  DATA_VIEWER = "DATA_VIEWER",
}

export enum FlowToExecutionPlanValidationError {
  "NO_ENTRY",
  "INVALID_INPUTS",
}
export enum WorkflowExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum ExecutionPhaseStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CREATED = "CREATED",
}

export enum WorkflowExecutionTrigger {
  MANUAL = "MANUAL",
  CRON = "CRON",
}

export interface AppNodeData {
  [key: string]: any;
  type: TaskType;
  inputs: Record<string, string>;
}

export interface AppNode extends Node {
  data: AppNodeData;
}

export interface TaskParam {
  name: string;
  type: TaskParamType;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  [key: string]: any;
}

export interface ParamProps {
  param: TaskParam;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
  disabled?: boolean;
}

export type WorkflowTask = {
  label: string;
  icon: React.FC<LucideProps>;
  type: TaskType;
  isEntryPoint?: boolean;
  inputs: TaskParam[];
  outputs: TaskParam[];
};

export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
};
export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

export type AppNodeMissingInputs = {
  nodeId: string;
  inputs: string[];
};

export type Enviornment = {
  phases: {
    [key: string]: {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    };
  };
};

export const LogLevels = ["info", "error"] as const;
export type LogLevel = (typeof LogLevels)[number];

export type Log = { message: string; level: LogLevel; timeStamp: Date };

export type LogFunction = (message: string) => void;

export type LogCollector = {
  getAll(): Log[];
} & {
  [key in LogLevel]: LogFunction;
};

export interface GitHubRepository {
  name: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  language: string;
  created_at: string;
  updated_at: string;
  size: number;
  default_branch: string;
  open_issues: number;
  owner: {
    login: string;
    avatar_url: string;
  };
  topics: string[];
  license?: { name: string };
}

export interface GitHubAnalysis {
  readme: string;
  languages: Record<string, number>;
  fileStructure: any[];
  fullFileStructure: any[];
  packageJson: any;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  projectAnalysis: string;
  architectureAnalysis: string;
}

export interface GitHubScrapedData extends GitHubRepository, GitHubAnalysis {}

export type ExecutionEnviornment<T extends WorkflowTask> = {
  getInput(name: T["inputs"][number]["name"]): string;
  setOutput(name: T["outputs"][number]["name"], value: string): void;
  log: LogCollector;
  userId: string;
};

export type Period = {
  year: number;
  month: number;
};

export type WorkflowExecutionType = Record<
  string,
  {
    success: number;
    failed: number;
  }
>;

// Collaboration Types
export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  cursor?: { x: number; y: number };
  selection?: string[];
  isOnline: boolean;
  lastSeen: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'file';
  replyTo?: string;
}

export interface WorkflowShare {
  id: string;
  workflowId: string;
  shareToken: string;
  permissions: 'view' | 'edit' | 'admin';
  expiresAt?: Date;
  createdBy: string;
  createdAt: Date;
}

export interface CollaborationSession {
  workflowId: string;
  users: CollaborationUser[];
  chat: ChatMessage[];
  isVideoCallActive: boolean;
  videoCallParticipants: string[];
}
