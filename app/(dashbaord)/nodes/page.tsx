"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { TaskType } from "@/lib/types";
import { Search } from "lucide-react";

const nodeCategories = {
  "Core": [TaskType.START, TaskType.WEBHOOK, TaskType.SCHEDULE_TRIGGER, TaskType.MANUAL_TRIGGER],
  "Google Workspace": [TaskType.GOOGLE_SHEETS, TaskType.GOOGLE_DOCS, TaskType.GOOGLE_DRIVE, TaskType.GOOGLE_CALENDAR, TaskType.GMAIL],
  "Communication": [TaskType.SLACK, TaskType.DISCORD, TaskType.TELEGRAM, TaskType.EMAIL, TaskType.SMS],
  "Social Media": [TaskType.TWITTER, TaskType.LINKEDIN, TaskType.FACEBOOK, TaskType.INSTAGRAM],
  "Development": [TaskType.GITHUB, TaskType.GITLAB, TaskType.JIRA, TaskType.TRELLO],
  "Data Processing": [TaskType.HTTP_REQUEST, TaskType.JSON_PROCESSOR, TaskType.CSV_PROCESSOR, TaskType.TEXT_PROCESSOR, TaskType.DATE_TIME],
  "AI & ML": [TaskType.OPENAI, TaskType.ANTHROPIC, TaskType.HUGGING_FACE],
  "Database": [TaskType.MYSQL, TaskType.POSTGRESQL, TaskType.MONGODB, TaskType.REDIS],
  "Cloud Storage": [TaskType.AWS_S3, TaskType.DROPBOX, TaskType.ONEDRIVE],
  "E-commerce": [TaskType.SHOPIFY, TaskType.STRIPE, TaskType.PAYPAL],
  "Productivity": [TaskType.NOTION, TaskType.AIRTABLE, TaskType.TODOIST, TaskType.ASANA],
  "Utilities": [TaskType.DELAY, TaskType.CONDITION, TaskType.LOOP, TaskType.MERGE, TaskType.SPLIT, TaskType.FILTER, TaskType.SORT],
};

export default function NodesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = Object.entries(nodeCategories).reduce((acc, [category, nodes]) => {
    const filteredNodes = nodes.filter(nodeType => {
      const task = TaskRegistry[nodeType];
      return task.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
             category.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    if (filteredNodes.length > 0) {
      acc[category] = filteredNodes;
    }
    
    return acc;
  }, {} as Record<string, TaskType[]>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold">Node Library</h1>
          <p className="text-muted-foreground">
            Explore all available nodes for building powerful automation workflows
          </p>
        </div>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(filteredCategories).map(([category, nodes]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {category}
                <Badge variant="secondary">{nodes.length} nodes</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {nodes.map((nodeType) => {
                  const task = TaskRegistry[nodeType];
                  const IconComponent = task.icon;
                  
                  return (
                    <div
                      key={nodeType}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <IconComponent size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{task.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {task.inputs.length} inputs • {task.outputs.length} outputs
                        </div>
                      </div>
                      {task.isEntryPoint && (
                        <Badge variant="outline" className="text-xs">
                          Entry
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(filteredCategories).length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No nodes found matching your search.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automate assignment submissions with Google Sheets + Gmail</li>
                <li>• Create study reminders with Schedule Trigger + Slack</li>
                <li>• Process research data with HTTP Request + OpenAI</li>
                <li>• Organize notes with Notion + Google Drive</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Popular Combinations</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Google Sheets → Condition → Slack (Data alerts)</li>
                <li>• HTTP Request → JSON Processor → Discord (API monitoring)</li>
                <li>• Schedule Trigger → OpenAI → Gmail (Daily summaries)</li>
                <li>• Webhook → Filter → Multiple outputs (Event processing)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}