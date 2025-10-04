import { TaskType } from "../types";

export interface WorkflowPattern {
  id: string;
  keywords: string[];
  nodes: Array<{
    type: TaskType;
    label: string;
    position: { x: number; y: number };
    data: any;
  }>;
  edges: Array<{
    source: string;
    target: string;
  }>;
  score: number;
  usage: number;
}

export interface LearningData {
  prompt: string;
  nodes: TaskType[];
  success: number;
  usage: number;
  feedback: number;
}

export interface WorkflowNode {
  id: string;
  type: TaskType;
  position: { x: number; y: number };
  data: {
    label: string;
    inputs: Record<string, string>;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface GeneratedWorkflow {
  title: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  confidence: number;
  usage: number;
}