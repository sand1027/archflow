import { TaskType } from "../types";
import { LearningData } from "./types";

export class LearningEngine {
  private learningData: Map<string, LearningData> = new Map();
  private nodeWeights: Map<TaskType, number> = new Map();
  private qTable: Map<string, Map<TaskType, number>> = new Map(); // Q-learning table
  private learningRate = 0.1;
  private discountFactor = 0.9;
  private explorationRate = 0.1;

  recordSuccess(prompt: string, successful: boolean) {
    const key = this.generatePromptKey(prompt);
    const data = this.learningData.get(key);
    if (data) {
      // Q-learning update
      const reward = successful ? 1 : -0.5;
      this.updateQValues(key, data.nodes, reward);
      
      // Traditional success tracking
      data.success = successful ? 
        Math.min(1, data.success + 0.1) : 
        Math.max(0, data.success - 0.1);
      data.feedback++;
    }
  }

  recordNodeFeedback(nodeType: TaskType, helpful: boolean) {
    const reward = helpful ? 0.05 : -0.05;
    this.adjustNodeWeights(nodeType, reward);
    
    // Update Q-values for this node type
    this.updateNodeQValue(nodeType, helpful ? 0.1 : -0.1);
  }

  findSimilarWorkflow(prompt: string) {
    const words = prompt.toLowerCase().split(/\s+/);
    let bestMatch = null;
    let bestScore = 0;

    for (const [key, data] of Array.from(this.learningData.entries())) {
      const similarity = this.calculateSimilarity(words, data.prompt.split(/\s+/));
      const score = similarity * data.success * (1 + data.usage / 10);
      
      if (score > bestScore && score > 0.6) {
        bestScore = score;
        bestMatch = data;
      }
    }

    return bestMatch;
  }

  storeLearningData(prompt: string, nodeTypes: TaskType[]) {
    const key = this.generatePromptKey(prompt);
    
    if (this.learningData.has(key)) {
      const data = this.learningData.get(key)!;
      data.usage++;
    } else {
      this.learningData.set(key, {
        prompt,
        nodes: nodeTypes,
        success: 0.5,
        usage: 1,
        feedback: 0
      });
    }
  }

  getNodeWeight(nodeType: TaskType): number {
    const baseWeight = this.nodeWeights.get(nodeType) || 1.0;
    const qValue = this.qTable.get('global')?.get(nodeType) || 0;
    // Combine traditional weight with Q-value
    return Math.max(0.1, baseWeight + qValue * 0.5);
  }

  exportLearningData() {
    return Array.from(this.learningData.entries());
  }

  importLearningData(data: [string, any][]) {
    this.learningData = new Map(data);
  }

  private adjustNodeWeights(nodeType: TaskType, adjustment: number) {
    const current = this.nodeWeights.get(nodeType) || 1.0;
    this.nodeWeights.set(nodeType, Math.max(0.1, Math.min(2.0, current + adjustment)));
  }

  private updateQValues(state: string, actions: TaskType[], reward: number) {
    if (!this.qTable.has(state)) {
      this.qTable.set(state, new Map());
    }
    
    const stateQValues = this.qTable.get(state)!;
    
    // Update Q-values for each action in the sequence
    actions.forEach((action, index) => {
      const currentQ = stateQValues.get(action) || 0;
      const futureReward = index < actions.length - 1 ? this.getMaxQValue(state) * this.discountFactor : 0;
      const newQ = currentQ + this.learningRate * (reward + futureReward - currentQ);
      stateQValues.set(action, newQ);
    });
  }

  private updateNodeQValue(nodeType: TaskType, reward: number) {
    const globalState = 'global';
    if (!this.qTable.has(globalState)) {
      this.qTable.set(globalState, new Map());
    }
    
    const stateQValues = this.qTable.get(globalState)!;
    const currentQ = stateQValues.get(nodeType) || 0;
    const newQ = currentQ + this.learningRate * reward;
    stateQValues.set(nodeType, newQ);
  }

  private getMaxQValue(state: string): number {
    const stateQValues = this.qTable.get(state);
    if (!stateQValues || stateQValues.size === 0) return 0;
    return Math.max(...Array.from(stateQValues.values()));
  }

  getBestAction(state: string, availableActions: TaskType[]): TaskType | null {
    const stateQValues = this.qTable.get(state);
    if (!stateQValues) return null;
    
    // Epsilon-greedy exploration
    if (Math.random() < this.explorationRate) {
      return availableActions[Math.floor(Math.random() * availableActions.length)];
    }
    
    // Exploitation: choose best action
    let bestAction: TaskType | null = null;
    let bestValue = -Infinity;
    
    for (const action of availableActions) {
      const qValue = stateQValues.get(action) || 0;
      if (qValue > bestValue) {
        bestValue = qValue;
        bestAction = action;
      }
    }
    
    return bestAction;
  }

  private calculateSimilarity(words1: string[], words2: string[]): number {
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set(Array.from(set1).filter(x => set2.has(x)));
    const union = new Set([...Array.from(set1), ...Array.from(set2)]);
    return intersection.size / union.size;
  }

  private generatePromptKey(prompt: string): string {
    return prompt.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  }
}