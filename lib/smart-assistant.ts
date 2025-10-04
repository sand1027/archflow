export interface AssistantSuggestion {
  type: 'optimization' | 'error' | 'enhancement' | 'cost';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  action?: () => void;
}

export function getSmartSuggestions(workflowData: any): AssistantSuggestion[] {
  return [
    {
      type: 'optimization',
      title: 'Reduce API Costs',
      description: 'Switch from GPT-4 to GPT-3.5 Turbo to save 90% on costs',
      impact: 'high'
    },
    {
      type: 'error',
      title: 'Add Error Handling',
      description: 'Your workflow lacks error handling for API failures',
      impact: 'medium'
    },
    {
      type: 'enhancement',
      title: 'Cache Responses',
      description: 'Cache API responses to improve performance by 60%',
      impact: 'medium'
    }
  ];
}