export interface MarketplaceWorkflow {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  downloads: number;
  rating: number;
  tags: string[];
  workflow: any;
}

export const featuredWorkflows: MarketplaceWorkflow[] = [
  {
    id: "student-assignment-tracker",
    title: "Student Assignment Tracker",
    description: "Automatically track assignments from Google Classroom and send reminders",
    category: "Education",
    author: "WorkFlex Team",
    downloads: 1250,
    rating: 4.8,
    tags: ["education", "google-classroom", "reminders"],
    workflow: {}
  },
  {
    id: "social-media-scheduler",
    title: "AI Social Media Scheduler",
    description: "Generate and schedule social media posts using AI",
    category: "Marketing",
    author: "Community",
    downloads: 890,
    rating: 4.6,
    tags: ["social-media", "ai", "scheduling"],
    workflow: {}
  }
];