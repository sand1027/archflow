import { TaskType } from "./types";
import { WorkflowBuilder } from "./workflow-ai";

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

export class ReinforcementWorkflowAI {
  private workflowBuilder = new WorkflowBuilder();

  generateWorkflow(prompt: string) {
    return this.workflowBuilder.buildWorkflow(prompt);
  }

  recordSuccess(prompt: string, successful: boolean) {
    this.workflowBuilder.recordFeedback(prompt, successful);
  }

  recordNodeFeedback(nodeType: TaskType, helpful: boolean) {
    this.workflowBuilder.recordNodeFeedback(nodeType, helpful);
  }

  exportLearningData() {
    // Delegate to workflow builder if needed
    return [];
  }

  importLearningData(data: [string, any][]) {
    // Delegate to workflow builder if needed
  }

  // Pattern-based workflow generation (legacy support)
  private patterns: WorkflowPattern[] = [
    {
      id: "email-automation",
      keywords: ["email", "gmail", "send", "reply", "mail"],
      nodes: [
        { 
          type: TaskType.MANUAL_TRIGGER, 
          label: "Start", 
          position: { x: 50, y: 200 }, 
          data: {
            inputs: {}
          }
        },
        { 
          type: TaskType.GMAIL, 
          label: "Read Gmail", 
          position: { x: 250, y: 200 }, 
          data: {
            inputs: {
              "Action": "read",
              "Max Results": "10",
              "Query": "is:unread"
            }
          }
        },
        { 
          type: TaskType.CONDITION, 
          label: "Check Priority", 
          position: { x: 450, y: 200 }, 
          data: {
            inputs: {
              "Condition": "{{Gmail.Subject}} contains 'urgent'",
              "Operator": "contains"
            }
          }
        },
        { 
          type: TaskType.OPENAI, 
          label: "Generate Reply", 
          position: { x: 650, y: 200 }, 
          data: {
            inputs: {
              "Model": "gpt-3.5-turbo",
              "Prompt": "Generate a professional email reply to: {{Gmail.Body}}",
              "Max Tokens": "200",
              "Temperature": "0.7"
            }
          }
        },
        { 
          type: TaskType.GMAIL, 
          label: "Send Reply", 
          position: { x: 850, y: 200 }, 
          data: {
            inputs: {
              "Action": "send",
              "To": "{{Gmail.From}}",
              "Subject": "Re: {{Gmail.Subject}}",
              "Body": "{{OpenAI.Response}}"
            }
          }
        }
      ],
      edges: [
        { source: "node-1", target: "node-2" },
        { source: "node-2", target: "node-3" },
        { source: "node-3", target: "node-4" },
        { source: "node-4", target: "node-5" }
      ],
      score: 0.9,
      usage: 45
    },
    {
      id: "data-processing",
      keywords: ["sheets", "data", "process", "analyze", "csv"],
      nodes: [
        { 
          type: TaskType.SCHEDULE_TRIGGER, 
          label: "Daily Trigger", 
          position: { x: 50, y: 200 }, 
          data: {
            inputs: {
              "Cron Expression": "0 9 * * *",
              "Timezone": "UTC"
            }
          }
        },
        { 
          type: TaskType.GOOGLE_SHEETS, 
          label: "Read Sheet", 
          position: { x: 300, y: 200 }, 
          data: {
            inputs: {
              "Action": "read",
              "Spreadsheet ID": "your-spreadsheet-id",
              "Range": "A1:Z1000",
              "Sheet Name": "Sheet1"
            }
          }
        },
        { 
          type: TaskType.OPENAI, 
          label: "Analyze Data", 
          position: { x: 550, y: 200 }, 
          data: {
            inputs: {
              "Model": "gpt-3.5-turbo",
              "Prompt": "Analyze this data and provide insights: {{GoogleSheets.Data}}",
              "Max Tokens": "500",
              "Temperature": "0.3"
            }
          }
        },
        { 
          type: TaskType.GOOGLE_SHEETS, 
          label: "Update Results", 
          position: { x: 800, y: 200 }, 
          data: {
            inputs: {
              "Action": "append",
              "Spreadsheet ID": "your-spreadsheet-id",
              "Range": "Results!A:B",
              "Values": "{{OpenAI.Response}}"
            }
          }
        }
      ],
      edges: [
        { source: "node-1", target: "node-2" },
        { source: "node-2", target: "node-3" },
        { source: "node-3", target: "node-4" }
      ],
      score: 0.85,
      usage: 32
    },
    {
      id: "web-scraping-mongo",
      keywords: ["website", "scrape", "web", "mongo", "mongodb", "store", "save", "database"],
      nodes: [
        { 
          type: TaskType.MANUAL_TRIGGER, 
          label: "Start Scraping", 
          position: { x: 50, y: 200 }, 
          data: {
            inputs: {}
          }
        },
        { 
          type: TaskType.HTTP_REQUEST, 
          label: "Fetch Website", 
          position: { x: 300, y: 200 }, 
          data: {
            inputs: {
              "Method": "GET",
              "URL": "https://example.com",
              "Headers": "{\"User-Agent\": \"Mozilla/5.0\"}"
            }
          }
        },
        { 
          type: TaskType.CODE, 
          label: "Extract Data", 
          position: { x: 550, y: 200 }, 
          data: {
            inputs: {
              "Language": "javascript",
              "Code": "// Extract data from HTML\nconst data = {\n  title: 'extracted title',\n  content: 'extracted content'\n};\nreturn data;"
            }
          }
        },
        { 
          type: TaskType.MONGODB, 
          label: "Save to MongoDB", 
          position: { x: 800, y: 200 }, 
          data: {
            inputs: {
              "Action": "insert",
              "Collection": "scraped_data",
              "Document": "{{Code.Result}}"
            }
          }
        }
      ],
      edges: [
        { source: "node-1", target: "node-2" },
        { source: "node-2", target: "node-3" },
        { source: "node-3", target: "node-4" }
      ],
      score: 0.8,
      usage: 15
    },
    {
      id: "api-to-database",
      keywords: ["api", "fetch", "get", "database", "store", "save", "collect"],
      nodes: [
        { 
          type: TaskType.SCHEDULE_TRIGGER, 
          label: "Scheduled Fetch", 
          position: { x: 50, y: 200 }, 
          data: {
            inputs: {
              "Cron Expression": "0 */6 * * *",
              "Timezone": "UTC"
            }
          }
        },
        { 
          type: TaskType.HTTP_REQUEST, 
          label: "Fetch API Data", 
          position: { x: 300, y: 200 }, 
          data: {
            inputs: {
              "Method": "GET",
              "URL": "https://api.example.com/data",
              "Headers": "{\"Authorization\": \"Bearer {{API_KEY}}\"}"
            }
          }
        },
        { 
          type: TaskType.MONGODB, 
          label: "Store in Database", 
          position: { x: 550, y: 200 }, 
          data: {
            inputs: {
              "Action": "insert",
              "Collection": "api_data",
              "Document": "{{HttpRequest.Response}}"
            }
          }
        }
      ],
      edges: [
        { source: "node-1", target: "node-2" },
        { source: "node-2", target: "node-3" }
      ],
      score: 0.75,
      usage: 8
    }
  ];

  // Old pattern-based methods (kept for compatibility)
  private oldGenerateWorkflow(prompt: string) {
    const words = prompt.toLowerCase().split(/\s+/);
    const bestPattern = this.findBestPattern(words);
    
    if (bestPattern) {
      this.updatePatternScore(bestPattern.id, true);
      return this.createWorkflowFromPattern(bestPattern, prompt);
    }
    
    return this.createFallbackWorkflow(prompt);
  }

  private findBestPattern(words: string[]): WorkflowPattern | null {
    let bestMatch: WorkflowPattern | null = null;
    let bestScore = 0;

    for (const pattern of this.patterns) {
      const matchScore = this.calculateMatchScore(words, pattern);
      const reinforcementScore = pattern.score * (1 + pattern.usage / 100);
      const totalScore = matchScore * reinforcementScore;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestMatch = pattern;
      }
    }

    return bestScore > 0.2 ? bestMatch : null;
  }

  private calculateMatchScore(words: string[], pattern: WorkflowPattern): number {
    const matches = pattern.keywords.filter(keyword => 
      words.some(word => word.includes(keyword) || keyword.includes(word))
    );
    return matches.length / pattern.keywords.length;
  }

  private updatePatternScore(patternId: string, success: boolean) {
    const pattern = this.patterns.find(p => p.id === patternId);
    if (pattern) {
      pattern.usage += 1;
      pattern.score = success ? 
        Math.min(1, pattern.score + 0.01) : 
        Math.max(0.1, pattern.score - 0.05);
    }
  }

  private createWorkflowFromPattern(pattern: WorkflowPattern, prompt: string) {
    return {
      title: this.generateTitle(pattern.id),
      description: `Generated from: "${prompt}"`,
      nodes: pattern.nodes.map((node, index) => {
        const smartInputs = this.generateSmartInputs(node, prompt, pattern.id);
        return {
          id: `node-${index + 1}`,
          type: node.type,
          position: node.position,
          data: { 
            ...node.data, 
            label: node.label,
            inputs: { ...node.data.inputs, ...smartInputs }
          }
        };
      }),
      edges: pattern.edges.map(edge => ({
        id: `edge-${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target
      })),
      confidence: pattern.score,
      usage: pattern.usage
    };
  }

  private createFallbackWorkflow(prompt: string) {
    return {
      title: "Custom Workflow",
      description: `Generated from: "${prompt}"`,
      nodes: [
        {
          id: "node-1",
          type: TaskType.MANUAL_TRIGGER,
          position: { x: 50, y: 200 },
          data: { 
            label: "Start",
            inputs: {}
          }
        },
        {
          id: "node-2", 
          type: TaskType.HTTP_REQUEST,
          position: { x: 350, y: 200 },
          data: { 
            label: "Custom Action",
            inputs: {
              "Method": "GET",
              "URL": "https://api.example.com/data",
              "Headers": "{\"Content-Type\": \"application/json\"}"
            }
          }
        }
      ],
      edges: [
        { id: "edge-1", source: "node-1", target: "node-2" }
      ],
      confidence: 0.5,
      usage: 0
    };
  }

  private generateTitle(patternId: string): string {
    const titles = {
      "email-automation": "Email Automation Workflow",
      "data-processing": "Data Processing Pipeline",
      "web-scraping-mongo": "Web Scraping to MongoDB",
      "api-to-database": "API Data Collection",
      "social-media": "Social Media Manager",
      "notification": "Smart Notification System"
    };
    return titles[patternId as keyof typeof titles] || "AI Generated Workflow";
  }

  analyzeWorkflow(nodes: any[], edges: any[]) {
    const analysis = {
      complexity: this.calculateComplexity(nodes, edges),
      estimatedCost: this.estimateCost(nodes),
      performance: this.analyzePerformance(nodes),
      suggestions: this.generateSuggestions(nodes, edges)
    };
    
    return analysis;
  }

  private calculateComplexity(nodes: any[], edges: any[]): string {
    const score = nodes.length + edges.length * 0.5;
    if (score < 5) return "Simple";
    if (score < 10) return "Medium";
    return "Complex";
  }

  private estimateCost(nodes: any[]): number {
    const costs: Record<string, number> = {
      [TaskType.OPENAI]: 0.002,
      [TaskType.ANTHROPIC]: 0.001,
      [TaskType.HTTP_REQUEST]: 0.0001
    };
    
    return nodes.reduce((total, node) => {
      return total + (costs[node.type] || 0);
    }, 0);
  }

  private analyzePerformance(nodes: any[]): string {
    const aiNodes = nodes.filter(n => 
      [TaskType.OPENAI, TaskType.ANTHROPIC].includes(n.type)
    );
    
    if (aiNodes.length > 3) return "Slow";
    if (aiNodes.length > 1) return "Medium";
    return "Fast";
  }

  private generateSuggestions(nodes: any[], edges: any[]): string[] {
    const suggestions = [];
    
    const aiNodes = nodes.filter(n => 
      [TaskType.OPENAI, TaskType.ANTHROPIC].includes(n.type)
    );
    
    if (aiNodes.length > 2) {
      suggestions.push("Consider reducing AI nodes to improve performance");
    }
    
    if (edges.length < nodes.length - 1) {
      suggestions.push("Some nodes appear disconnected");
    }
    
    const hasErrorHandling = nodes.some(n => n.type === TaskType.CONDITION);
    if (!hasErrorHandling) {
      suggestions.push("Add error handling with condition nodes");
    }
    
    return suggestions;
  }

  private generateSmartInputs(node: any, prompt: string, patternId: string): Record<string, string> {
    const words = prompt.toLowerCase();
    const smartInputs: Record<string, string> = {};

    // Context-aware input generation
    if (node.type === TaskType.OPENAI) {
      if (words.includes('summary') || words.includes('summarize')) {
        smartInputs['Prompt'] = `Summarize the following content: {{PreviousNode.Output}}`;
        smartInputs['Max Tokens'] = '300';
      } else if (words.includes('translate')) {
        smartInputs['Prompt'] = `Translate this to English: {{PreviousNode.Output}}`;
      } else if (words.includes('code') || words.includes('programming')) {
        smartInputs['Prompt'] = `Generate code for: ${prompt}`;
        smartInputs['Temperature'] = '0.2';
      }
    }

    if (node.type === TaskType.GOOGLE_SHEETS) {
      if (words.includes('daily') || words.includes('report')) {
        smartInputs['Sheet Name'] = 'Daily Reports';
      } else if (words.includes('data') || words.includes('analytics')) {
        smartInputs['Sheet Name'] = 'Analytics Data';
      }
    }

    if (node.type === TaskType.SCHEDULE_TRIGGER) {
      if (words.includes('daily')) {
        smartInputs['Cron Expression'] = '0 9 * * *'; // 9 AM daily
      } else if (words.includes('weekly')) {
        smartInputs['Cron Expression'] = '0 9 * * 1'; // 9 AM Monday
      } else if (words.includes('hourly')) {
        smartInputs['Cron Expression'] = '0 * * * *'; // Every hour
      }
    }

    if (node.type === TaskType.CONDITION) {
      if (words.includes('urgent') || words.includes('priority')) {
        smartInputs['Condition'] = '{{PreviousNode.Subject}} contains "urgent"';
      } else if (words.includes('error') || words.includes('fail')) {
        smartInputs['Condition'] = '{{PreviousNode.Status}} equals "error"';
      }
    }

    return smartInputs;
  }
}