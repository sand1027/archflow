# WorkFlex - Student-Friendly Automation Platform

WorkFlex is a powerful, visual workflow automation platform designed specifically for students and professionals. Build complex automation workflows using a drag-and-drop interface with 50+ pre-built integrations.

## 🚀 Features

### Core Automation Nodes
- **Start Triggers**: Manual, Webhook, and Schedule-based workflow triggers
- **Conditional Logic**: Smart decision-making with if-then conditions
- **Data Processing**: JSON, CSV, and text manipulation tools
- **Utilities**: Delay, merge, split, filter, and sort operations

### Popular Integrations
- **Google Workspace**: Sheets, Docs, Drive, Calendar, Gmail
- **Communication**: Slack, Discord, Telegram, Email, SMS
- **AI & ML**: OpenAI, Anthropic, Hugging Face
- **Social Media**: Twitter, LinkedIn, Facebook, Instagram
- **Development**: GitHub, GitLab, Jira, Trello
- **Productivity**: Notion, Airtable, Todoist, Asana
- **Database**: MySQL, PostgreSQL, MongoDB, Redis
- **Cloud Storage**: AWS S3, Dropbox, OneDrive
- **E-commerce**: Shopify, Stripe, PayPal

## 🎓 Perfect for Students

### Common Use Cases
- **Assignment Management**: Automate submission reminders and deadline tracking
- **Research Automation**: Process data from APIs and generate reports
- **Study Groups**: Coordinate with classmates via Slack/Discord integration
- **Project Organization**: Sync data between Notion, Google Sheets, and GitHub
- **Grade Tracking**: Monitor academic progress with automated notifications

### Example Workflows
1. **Study Reminder System**: Schedule Trigger → Condition (check deadline) → Slack notification
2. **Research Data Pipeline**: HTTP Request → JSON Processor → Google Sheets → Gmail summary
3. **Assignment Tracker**: Google Sheets → Condition → Discord alert → Notion update
4. **AI-Powered Notes**: Gmail → OpenAI summarization → Notion page creation

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, MongoDB, Mongoose
- **Authentication**: Clerk
- **UI Components**: Radix UI, Lucide Icons
- **Workflow Engine**: Custom execution engine with visual flow editor
- **Deployment**: Vercel-ready with serverless architecture

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/workflex.git
   cd workflex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string
   
   # API Keys for Integrations
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   SLACK_BOT_TOKEN=your_slack_bot_token
   DISCORD_BOT_TOKEN=your_discord_bot_token
   NOTION_API_KEY=your_notion_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### Creating Your First Workflow

1. **Sign up** and complete the setup process
2. **Navigate to Workflows** and click "Create Workflow"
3. **Drag nodes** from the sidebar to the canvas
4. **Connect nodes** by dragging from output handles to input handles
5. **Configure each node** by clicking on it and filling in the parameters
6. **Test your workflow** using the Execute button
7. **Publish** when ready for production use

### Node Configuration

Each node has:
- **Inputs**: Data or parameters the node needs to function
- **Outputs**: Data the node produces for downstream nodes
- **Credentials**: API keys or authentication tokens (stored securely)

### Credential Management

- Store API keys and tokens securely in the Credentials section
- Credentials are encrypted and can be reused across workflows
- Support for OAuth flows for Google, Slack, and other services

## 🔧 Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main application pages
│   └── api/               # API routes
├── components/            # Reusable UI components
├── lib/                   # Utilities and core logic
│   ├── workflow/          # Workflow engine
│   │   ├── task/         # Node definitions
│   │   └── executor/     # Node execution logic
│   └── types.ts          # TypeScript definitions
└── schema/               # Database schemas
```

### Adding New Nodes

1. **Create the task definition** in `lib/workflow/task/`
2. **Create the executor** in `lib/workflow/executor/`
3. **Register both** in their respective Registry files
4. **Add the TaskType** to the enum in `lib/types.ts`

Example node structure:
```typescript
// Task Definition
export const MyServiceTask = {
  type: TaskType.MY_SERVICE,
  label: "My Service",
  icon: (props: LucideProps) => <Icon {...props} />,
  inputs: [
    {
      name: "API Key",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;

// Executor
export async function MyServiceExecutor(
  environment: ExecutionEnvironment<typeof MyServiceTask>
): Promise<boolean> {
  // Implementation logic
  return true;
}
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.workflex.dev](https://docs.workflex.dev)
- **Discord Community**: [Join our Discord](https://discord.gg/workflex)
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/workflex/issues)
- **Email**: support@workflex.dev

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by [n8n](https://n8n.io/) and [Zapier](https://zapier.com/)

---

**Made with ❤️ for students and automation enthusiasts**