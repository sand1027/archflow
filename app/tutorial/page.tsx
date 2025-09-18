"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskType } from "@/lib/types";
import { Play, BookOpen, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import TutorialNode from "./_components/TutorialNode";
import WorkflowExample from "./_components/WorkflowExample";
import NodeDetails from "./_components/NodeDetails";
import ConnectionGuide from "./_components/ConnectionGuide";
import NodeBrowser from "./_components/NodeBrowser";
import TutorialNavbar from "./_components/TutorialNavbar";
import { motion, AnimatePresence } from "framer-motion";

const nodeCategories = {
  "Core Triggers": [TaskType.START, TaskType.WEBHOOK, TaskType.SCHEDULE_TRIGGER, TaskType.MANUAL_TRIGGER],
  "Google Workspace": [TaskType.GOOGLE_SHEETS, TaskType.GMAIL],
  "Communication": [TaskType.SLACK, TaskType.DISCORD],
  "AI & ML": [TaskType.OPENAI, TaskType.ANTHROPIC, TaskType.HUGGING_FACE],
  "Data Processing": [TaskType.HTTP_REQUEST, TaskType.JSON_PROCESSOR],
  "Utilities": [TaskType.CONDITION, TaskType.DELAY, TaskType.NOTION]
};

const workflowExamples = [
  {
    title: "Data Processing Pipeline",
    description: "Fetch data from API, process it, save to spreadsheet, and notify team",
    nodes: [TaskType.START, TaskType.HTTP_REQUEST, TaskType.JSON_PROCESSOR, TaskType.GOOGLE_SHEETS, TaskType.SLACK],
    difficulty: "Beginner" as const,
    useCase: "Perfect for students tracking assignment data",
    connections: [
      "Start triggers the workflow manually",
      "HTTP Request fetches data from external API",
      "JSON Processor parses and formats the response",
      "Google Sheets saves the processed data",
      "Slack sends notification to team"
    ]
  },
  {
    title: "Student Assignment Tracker",
    description: "Track assignments, deadlines, and send reminders automatically",
    nodes: [TaskType.GOOGLE_SHEETS, TaskType.CONDITION, TaskType.SLACK, TaskType.GMAIL],
    difficulty: "Beginner" as const,
    useCase: "Never miss assignment deadlines again",
    connections: [
      "Google Sheets contains assignment data and deadlines",
      "Condition checks if deadline is approaching",
      "Slack sends team reminder",
      "Gmail sends personal email reminder"
    ]
  },
  {
    title: "AI Content Generation",
    description: "Generate daily content with AI, save to Notion, and email summary",
    nodes: [TaskType.SCHEDULE_TRIGGER, TaskType.OPENAI, TaskType.NOTION, TaskType.GMAIL],
    difficulty: "Intermediate" as const,
    useCase: "Automate daily study summaries and notes",
    connections: [
      "Schedule Trigger runs daily at 9 AM",
      "OpenAI generates content based on prompt",
      "Notion saves the generated content",
      "Gmail sends summary email"
    ]
  },
  {
    title: "Research Data Collector",
    description: "Collect research data from multiple APIs and compile reports",
    nodes: [TaskType.SCHEDULE_TRIGGER, TaskType.HTTP_REQUEST, TaskType.JSON_PROCESSOR, TaskType.OPENAI, TaskType.NOTION],
    difficulty: "Advanced" as const,
    useCase: "Automate research data collection and analysis",
    connections: [
      "Schedule Trigger runs daily to collect data",
      "HTTP Request fetches data from research APIs",
      "JSON Processor formats the collected data",
      "OpenAI analyzes and summarizes findings",
      "Notion creates organized research reports"
    ]
  },
  {
    title: "Webhook Processing",
    description: "Receive webhook, check conditions, and send notifications",
    nodes: [TaskType.WEBHOOK, TaskType.CONDITION, TaskType.SLACK],
    difficulty: "Advanced" as const,
    useCase: "Handle GitHub push notifications for group projects",
    connections: [
      "Webhook receives external data",
      "Condition checks if data meets criteria",
      "Slack sends notification if condition is true"
    ]
  }
];

export default function TutorialPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <TutorialNavbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            Interactive Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            WorkFlex Tutorial
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master automation workflows with hands-on examples and interactive node exploration
          </p>
        </div>

        {/* Quick Start Guide */}
        <Card className="mb-12 border-2 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Play className="h-6 w-6 text-primary" />
              Quick Start Guide
            </CardTitle>
            <p className="text-muted-foreground">Get started in 3 simple steps</p>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="font-semibold mb-2 text-lg">Choose a Trigger</h3>
                <p className="text-sm text-muted-foreground">Start with a trigger node like Start, Webhook, or Schedule</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="font-semibold mb-2 text-lg">Add Actions</h3>
                <p className="text-sm text-muted-foreground">Connect action nodes like HTTP Request, AI, or Google Sheets</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="font-semibold mb-2 text-lg">Configure & Run</h3>
                <p className="text-sm text-muted-foreground">Set up inputs, test your workflow, and publish</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Examples */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Common Workflow Patterns</h2>
            <p className="text-muted-foreground text-lg">Learn from real-world automation examples</p>
          </div>
          <div className="space-y-8">
            {workflowExamples.map((example, idx) => (
              <WorkflowExample key={idx} {...example} />
            ))}
          </div>
        </div>

        {/* Node Browser */}
        <NodeBrowser />

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">Ready to Build Your First Workflow?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start creating powerful automation workflows with WorkFlex's intuitive drag-and-drop interface
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-in">
              <Button size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}