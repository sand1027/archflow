import { cn } from "@/lib/utils";
import {
  BrainIcon,
  CodeIcon,
  DatabaseIcon,
  Edit3Icon,
  EyeIcon,
  FileJson2Icon,
  GlobeIcon,
  Link2Icon,
  MouseIcon,
  MousePointerClick,
  SendIcon,
  TextIcon,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Google Sheets Integration",
      description:
        "Read, write, and update Google Sheets data seamlessly. Perfect for managing student assignments and project data.",
      icon: <DatabaseIcon className="stroke-green-400" />,
      hoverChipClassName: "group-hover/feature:bg-green-500",
    },
    {
      title: "Slack & Discord Bots",
      description:
        "Send messages, create channels, and automate communication across your favorite platforms.",
      icon: <SendIcon className="stroke-purple-400" />,
      hoverChipClassName: "group-hover/feature:bg-purple-500",
    },
    {
      title: "OpenAI Integration",
      description:
        "Leverage AI for text generation, data analysis, and intelligent automation workflows.",
      icon: <BrainIcon className="stroke-emerald-400" />,
      hoverChipClassName: "group-hover/feature:bg-emerald-500",
    },
    {
      title: "HTTP API Requests",
      description:
        "Connect to any REST API with GET, POST, PUT, DELETE requests. Integrate with thousands of services.",
      icon: <GlobeIcon className="stroke-blue-400" />,
      hoverChipClassName: "group-hover/feature:bg-blue-500",
    },
    {
      title: "Gmail Automation",
      description:
        "Send emails, read messages, and automate your email workflows for assignments and notifications.",
      icon: <SendIcon className="stroke-red-400" />,
      hoverChipClassName: "group-hover/feature:bg-red-500",
    },
    {
      title: "Conditional Logic",
      description:
        "Add smart decision-making to your workflows with if-then conditions and branching logic.",
      icon: <CodeIcon className="stroke-yellow-400" />,
      hoverChipClassName: "group-hover/feature:bg-yellow-500",
    },
    {
      title: "Notion Integration",
      description:
        "Create pages, update databases, and organize your student life with powerful Notion automation.",
      icon: <Edit3Icon className="stroke-gray-400" />,
      hoverChipClassName: "group-hover/feature:bg-gray-500",
    },
    {
      title: "Schedule Triggers",
      description:
        "Run workflows automatically on schedules - daily reminders, weekly reports, or custom intervals.",
      icon: <EyeIcon className="stroke-amber-400" />,
      hoverChipClassName: "group-hover/feature:bg-amber-500",
    },
    {
      title: "JSON Processing",
      description:
        "Parse, filter, and transform JSON data between different services and APIs effortlessly.",
      icon: <FileJson2Icon className="stroke-orange-400" />,
      hoverChipClassName: "group-hover/feature:bg-orange-500",
    },
    {
      title: "Social Media APIs",
      description:
        "Connect to Twitter, LinkedIn, Facebook, and Instagram for social media automation and monitoring.",
      icon: <Link2Icon className="stroke-pink-400" />,
      hoverChipClassName: "group-hover/feature:bg-pink-500",
    },
    {
      title: "Database Connections",
      description:
        "Connect to MySQL, PostgreSQL, MongoDB, and Redis for powerful data storage and retrieval.",
      icon: <DatabaseIcon className="stroke-indigo-400" />,
      hoverChipClassName: "group-hover/feature:bg-indigo-500",
    },
    {
      title: "Cloud Storage",
      description:
        "Integrate with AWS S3, Dropbox, and OneDrive for file storage and management automation.",
      icon: <GlobeIcon className="stroke-cyan-400" />,
      hoverChipClassName: "group-hover/feature:bg-cyan-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature
          key={feature.title}
          {...feature}
          index={index}
          hoverChipClassName={feature.hoverChipClassName as string}
        />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
  hoverChipClassName,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  hoverChipClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div
          className={cn(
            "absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center",
            hoverChipClassName
          )}
        />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
