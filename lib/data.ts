import {
  HomeIcon,
  Layers2Icon,
  ShieldCheckIcon,
  BoxesIcon,
  Brain,
  Zap,
} from "lucide-react";

export const routes = [
  {
    href: "/home",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "/workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },

  {
    href: "/nodes",
    label: "Node Library",
    icon: BoxesIcon,
  },
  {
    href: "/credentials",
    label: "Credentials",
    icon: ShieldCheckIcon,
  },
  {
    href: "/ai-keys",
    label: "AI Keys",
    icon: Brain,
  },
  {
    href: "/demo-keys",
    label: "Demo Keys",
    icon: Zap,
  },
];

export const MONTH_NAME = [
  "Janauary",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const typeWriterWords = [
  {
    text: "Build",
  },
  {
    text: "Powerful",
  },
  {
    text: "Automation",
    className: "text-primary dark:text-primary",
  },
  {
    text: "Workflows.",
    className: "text-primary dark:text-primary",
  },
];

export const howItWorks = [
  {
    title: "Build Your Workflow",
    description:
      "Create powerful automation workflows with intuitive drag-and-drop tools and pre-built integrations.",
  },
  {
    title: "Connect Everything",
    description:
      "Integrate with Google Sheets, Slack, Discord, OpenAI, and 50+ other services seamlessly.",
  },
  {
    title: "Automate and Scale",
    description:
      "Schedule workflows, monitor execution stats, and scale your automation processes efficiently.",
  },
  {
    title: "Student-Friendly",
    description:
      "Perfect for students to automate assignments, projects, and daily tasks with easy-to-use tools.",
  },
];

export const headerRoutes = [
  {
    title: "How it works",
    href: "#howItWorks",
    className: "",
  },
  {
    title: "Automation Features",
    href: "#automationFeatures",
    className: "",
  },
  {
    title: "Get Started",
    href: "/auth/signin",
    className: "",
    button: true,
  },
];


