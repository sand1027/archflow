// Simple rule-based AI for workflow generation (no external API needed)
export class LocalWorkflowAI {
  private patterns = {
    email: ['gmail', 'email', 'mail', 'send', 'reply'],
    social: ['twitter', 'facebook', 'instagram', 'post', 'social'],
    data: ['sheets', 'database', 'csv', 'excel', 'data'],
    ai: ['openai', 'gpt', 'claude', 'gemini', 'generate', 'ai'],
    schedule: ['schedule', 'cron', 'timer', 'daily', 'weekly']
  };

  generateWorkflow(prompt: string) {
    const words = prompt.toLowerCase().split(' ');
    const detected = this.detectIntent(words);
    
    return this.buildWorkflow(detected, prompt);
  }

  private detectIntent(words: string[]) {
    const scores: Record<string, number> = {};
    
    Object.entries(this.patterns).forEach(([category, keywords]) => {
      scores[category] = keywords.filter(keyword => 
        words.some(word => word.includes(keyword))
      ).length;
    });
    
    return Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([category]) => category);
  }

  private buildWorkflow(intents: string[], prompt: string) {
    const nodes = [];
    let x = 100;
    
    // Start node
    nodes.push({
      id: 'start-1',
      type: 'START',
      position: { x, y: 100 },
      data: { label: 'Start' }
    });
    x += 200;
    
    // Add nodes based on detected intents
    intents.forEach(intent => {
      const nodeConfig = this.getNodeForIntent(intent, x);
      if (nodeConfig) {
        nodes.push(nodeConfig);
        x += 200;
      }
    });
    
    return {
      title: this.generateTitle(intents),
      description: `Generated from: "${prompt}"`,
      nodes,
      connections: this.generateConnections(nodes)
    };
  }

  private getNodeForIntent(intent: string, x: number) {
    const configs = {
      email: { type: 'GMAIL', label: 'Gmail Action' },
      social: { type: 'HTTP_REQUEST', label: 'Social Media Post' },
      data: { type: 'GOOGLE_SHEETS', label: 'Update Sheet' },
      ai: { type: 'OPENAI', label: 'AI Processing' },
      schedule: { type: 'SCHEDULE_TRIGGER', label: 'Schedule Trigger' }
    };
    
    const config = configs[intent as keyof typeof configs];
    if (!config) return null;
    
    return {
      id: `${intent}-1`,
      type: config.type,
      position: { x, y: 100 },
      data: { label: config.label }
    };
  }

  private generateTitle(intents: string[]) {
    const titles = {
      email: 'Email Automation',
      social: 'Social Media Workflow',
      data: 'Data Processing',
      ai: 'AI-Powered Workflow',
      schedule: 'Scheduled Task'
    };
    
    return intents.map(intent => titles[intent as keyof typeof titles])
      .filter(Boolean)
      .join(' + ') || 'Custom Workflow';
  }

  private generateConnections(nodes: any[]) {
    const connections = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      connections.push({
        source: nodes[i].id,
        target: nodes[i + 1].id
      });
    }
    return connections;
  }
}