import { TaskType } from "../types";
import { GeneratedWorkflow, WorkflowNode, WorkflowEdge } from "./types";
import { NodeDetector } from "./node-detector";
import { InputGenerator } from "./input-generator";
import { LabelGenerator } from "./label-generator";
import { LearningEngine } from "./learning-engine";

export class WorkflowBuilder {
  private nodeDetector = new NodeDetector();
  private inputGenerator = new InputGenerator();
  private labelGenerator = new LabelGenerator();
  private learningEngine = new LearningEngine();

  buildWorkflow(prompt: string): GeneratedWorkflow {
    const words = prompt.toLowerCase().split(/\s+/);
    
    // Check for similar learned workflows
    const similarWorkflow = this.learningEngine.findSimilarWorkflow(prompt);
    if (similarWorkflow && similarWorkflow.success > 0.7) {
      return this.buildFromLearned(similarWorkflow, prompt, words);
    }

    return this.buildDynamicWorkflow(prompt, words);
  }

  recordFeedback(prompt: string, successful: boolean) {
    this.learningEngine.recordSuccess(prompt, successful);
  }

  recordNodeFeedback(nodeType: TaskType, helpful: boolean) {
    this.learningEngine.recordNodeFeedback(nodeType, helpful);
  }

  private buildDynamicWorkflow(prompt: string, words: string[]): GeneratedWorkflow {
    const nodes: any[] = [];
    const edges: any[] = [];
    let nodeCount = 0;
    let x = 50;
    const y = 200;
    const spacing = 250;

    // Trigger node
    const triggerType = this.detectTriggerTypeWithLearning(words);
    nodes.push({
      id: `node-${++nodeCount}`,
      type: triggerType,
      position: { x, y },
      data: {
        label: this.labelGenerator.generateTriggerLabel(words),
        inputs: this.inputGenerator.generateTriggerInputs(words)
      }
    });
    x += spacing;

    // Source node
    const sourceType = this.detectSourceTypeWithLearning(words);
    if (sourceType) {
      nodes.push({
        id: `node-${++nodeCount}`,
        type: sourceType,
        position: { x, y },
        data: {
          label: this.labelGenerator.generateSourceLabel(sourceType, words),
          inputs: this.inputGenerator.generateSourceInputs(sourceType, words, prompt)
        }
      });
      edges.push({ source: `node-${nodeCount-1}`, target: `node-${nodeCount}` });
      x += spacing;
    }

    // Processing node
    const processingType = this.detectProcessingTypeWithLearning(words);
    if (processingType) {
      nodes.push({
        id: `node-${++nodeCount}`,
        type: processingType,
        position: { x, y },
        data: {
          label: this.labelGenerator.generateProcessingLabel(processingType, words),
          inputs: this.inputGenerator.generateProcessingInputs(processingType, words, prompt)
        }
      });
      edges.push({ source: `node-${nodeCount-1}`, target: `node-${nodeCount}` });
      x += spacing;
    }

    // Destination node
    const destType = this.detectDestinationTypeWithLearning(words);
    if (destType) {
      nodes.push({
        id: `node-${++nodeCount}`,
        type: destType,
        position: { x, y },
        data: {
          label: this.labelGenerator.generateDestinationLabel(destType, words),
          inputs: this.inputGenerator.generateDestinationInputs(destType, words, prompt)
        }
      });
      edges.push({ source: `node-${nodeCount-1}`, target: `node-${nodeCount}` });
    }

    const workflow = {
      title: this.labelGenerator.generateDynamicTitle(words),
      description: `Generated from: "${prompt}"`,
      nodes: nodes.map(node => ({
        ...node,
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map((edge, index) => ({
        id: `edge-${index + 1}`,
        source: edge.source,
        target: edge.target
      })),
      confidence: 0.8,
      usage: 1
    };

    // Store for learning
    const nodeTypes = workflow.nodes.map(n => n.type);
    this.learningEngine.storeLearningData(prompt, nodeTypes);

    return workflow;
  }

  private buildFromLearned(learned: any, prompt: string, words: string[]): GeneratedWorkflow {
    const nodes: any[] = [];
    const edges: any[] = [];
    let x = 50;
    const y = 200;
    const spacing = 250;

    learned.nodes.forEach((nodeType: TaskType, index: number) => {
      nodes.push({
        id: `node-${index + 1}`,
        type: nodeType,
        position: { x: x + (index * spacing), y },
        data: {
          label: this.labelGenerator.generateNodeLabel(nodeType, words),
          inputs: {}
        }
      });
      
      if (index > 0) {
        edges.push({ source: `node-${index}`, target: `node-${index + 1}` });
      }
    });

    return {
      title: this.labelGenerator.generateDynamicTitle(words),
      description: `Generated from learned pattern: "${prompt}"`,
      nodes,
      edges: edges.map((edge, index) => ({
        id: `edge-${index + 1}`,
        source: edge.source,
        target: edge.target
      })),
      confidence: learned.success,
      usage: learned.usage
    };
  }

  private detectTriggerTypeWithLearning(words: string[]): TaskType {
    const baseType = this.nodeDetector.detectTriggerType(words);
    const weight = this.learningEngine.getNodeWeight(baseType);
    return weight > 1.2 ? baseType : baseType;
  }

  private detectSourceTypeWithLearning(words: string[]): TaskType | null {
    const baseType = this.nodeDetector.detectSourceType(words);
    if (!baseType) return null;
    
    const weight = this.learningEngine.getNodeWeight(baseType);
    if (weight < 0.5) {
      const alternatives = [TaskType.HTTP_REQUEST, TaskType.MONGODB, TaskType.GOOGLE_SHEETS];
      for (const alt of alternatives) {
        if (alt !== baseType && this.learningEngine.getNodeWeight(alt) > weight) {
          return alt;
        }
      }
    }
    return baseType;
  }

  private detectProcessingTypeWithLearning(words: string[]): TaskType | null {
    const baseType = this.nodeDetector.detectProcessingType(words);
    if (!baseType) return null;
    
    const weight = this.learningEngine.getNodeWeight(baseType);
    return weight > 0.3 ? baseType : null;
  }

  private detectDestinationTypeWithLearning(words: string[]): TaskType | null {
    const baseType = this.nodeDetector.detectDestinationType(words);
    if (!baseType) return null;
    
    const weight = this.learningEngine.getNodeWeight(baseType);
    return weight > 0.3 ? baseType : null;
  }
}