import { TaskType } from "@/lib/types";

export const studentWorkflowTemplates = [
  {
    id: "assignment-reminder",
    name: "Assignment Reminder System",
    description: "Get notified about upcoming assignment deadlines via Slack",
    category: "Academic",
    nodes: [
      {
        id: "1",
        type: TaskType.SCHEDULE_TRIGGER,
        position: { x: 100, y: 100 },
        data: {
          type: TaskType.SCHEDULE_TRIGGER,
          inputs: {
            "Schedule": "0 9 * * *", // Daily at 9 AM
          }
        }
      },
      {
        id: "2", 
        type: TaskType.GOOGLE_SHEETS,
        position: { x: 300, y: 100 },
        data: {
          type: TaskType.GOOGLE_SHEETS,
          inputs: {
            "Action": "read",
            "Spreadsheet ID": "your-assignment-sheet-id",
            "Sheet Name": "Assignments",
            "Range": "A:D"
          }
        }
      },
      {
        id: "3",
        type: TaskType.CONDITION,
        position: { x: 500, y: 100 },
        data: {
          type: TaskType.CONDITION,
          inputs: {
            "Operator": "less_than",
            "Value 2": "3" // Days until due
          }
        }
      },
      {
        id: "4",
        type: TaskType.SLACK,
        position: { x: 700, y: 100 },
        data: {
          type: TaskType.SLACK,
          inputs: {
            "Action": "send_message",
            "Channel": "#assignments",
            "Message": "⚠️ Assignment due soon!"
          }
        }
      }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" }
    ]
  },
  {
    id: "research-pipeline",
    name: "Research Data Pipeline",
    description: "Fetch data from APIs, process with AI, and save to Google Sheets",
    category: "Research",
    nodes: [
      {
        id: "1",
        type: TaskType.HTTP_REQUEST,
        position: { x: 100, y: 100 },
        data: {
          type: TaskType.HTTP_REQUEST,
          inputs: {
            "Method": "GET",
            "URL": "https://api.example.com/research-data"
          }
        }
      },
      {
        id: "2",
        type: TaskType.OPENAI,
        position: { x: 300, y: 100 },
        data: {
          type: TaskType.OPENAI,
          inputs: {
            "Action": "chat",
            "Model": "gpt-3.5-turbo",
            "Prompt": "Analyze this research data and provide key insights"
          }
        }
      },
      {
        id: "3",
        type: TaskType.GOOGLE_SHEETS,
        position: { x: 500, y: 100 },
        data: {
          type: TaskType.GOOGLE_SHEETS,
          inputs: {
            "Action": "append",
            "Spreadsheet ID": "your-research-sheet-id",
            "Sheet Name": "Analysis"
          }
        }
      }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" }
    ]
  }
];

export const getTemplatesByCategory = () => {
  const categories = studentWorkflowTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof studentWorkflowTemplates>);
  
  return categories;
};