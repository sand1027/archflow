type CredentialTemplate = {
  label: string;
  description?: string;
  fields: Array<{
    key: string;
    label: string;
    type: string;
    placeholder: string;
    required?: boolean;
  }>;
  instructions?: string[];
};

export const credentialTemplates: Record<string, CredentialTemplate> = {
  GMAIL: {
    label: "Gmail",
    fields: [
      { key: "email", label: "Email Address", type: "email", placeholder: "your-email@gmail.com" },
      { key: "password", label: "App Password", type: "password", placeholder: "16-character app password" }
    ]
  },
  SLACK: {
    label: "Slack",
    fields: [
      { key: "token", label: "Bot Token", type: "password", placeholder: "xoxb-your-bot-token" },
      { key: "signing_secret", label: "Signing Secret", type: "password", placeholder: "your-signing-secret" }
    ]
  },
  OPENAI: {
    label: "OpenAI",
    fields: [
      { key: "api_key", label: "API Key", type: "password", placeholder: "sk-your-openai-api-key" }
    ]
  },
  NOTION: {
    label: "Notion",
    fields: [
      { key: "api_key", label: "Integration Token", type: "password", placeholder: "secret_your-notion-token" }
    ]
  },
  DISCORD: {
    label: "Discord",
    fields: [
      { key: "token", label: "Bot Token", type: "password", placeholder: "your-discord-bot-token" }
    ]
  },
  GITHUB: {
    label: "GitHub",
    fields: [
      { key: "token", label: "Personal Access Token", type: "password", placeholder: "ghp_your-github-token" }
    ]
  },
  GOOGLE_OAUTH: {
    label: "Google OAuth2",
    description: "Connect to Google services (Sheets, Docs, Drive, Calendar, Gmail)",
    fields: [
      { key: "access_token", label: "Access Token", type: "password", placeholder: "ya29.your-access-token", required: true },
      { key: "refresh_token", label: "Refresh Token (Optional)", type: "password", placeholder: "1//your-refresh-token", required: false },
      { key: "client_id", label: "Client ID (Optional)", type: "text", placeholder: "your-google-client-id", required: false },
      { key: "client_secret", label: "Client Secret (Optional)", type: "password", placeholder: "your-google-client-secret", required: false }
    ],
    instructions: [
      "1. Go to Google OAuth Playground: https://developers.google.com/oauthplayground/",
      "2. In Step 1, select these scopes:",
      "   • https://www.googleapis.com/auth/spreadsheets (for Sheets)",
      "   • https://www.googleapis.com/auth/documents (for Docs)",
      "   • https://www.googleapis.com/auth/drive (for Drive)",
      "   • https://www.googleapis.com/auth/calendar (for Calendar)",
      "   • https://www.googleapis.com/auth/gmail.modify (for Gmail)",
      "3. Click 'Authorize APIs' and sign in with your Google account",
      "4. Click 'Exchange authorization code for tokens'",
      "5. Copy the 'Access token' and paste it above"
    ]
  },
  GOOGLE_SHEETS: {
    label: "Google Sheets (Legacy)",
    fields: [
      { key: "access_token", label: "Access Token", type: "password", placeholder: "ya29.your-access-token" }
    ]
  },
  ANTHROPIC: {
    label: "Anthropic",
    fields: [
      { key: "api_key", label: "API Key", type: "password", placeholder: "sk-ant-your-anthropic-key" }
    ]
  },
  HUGGING_FACE: {
    label: "Hugging Face",
    fields: [
      { key: "api_key", label: "API Token", type: "password", placeholder: "hf_your-hugging-face-token" }
    ]
  },
  WEBHOOK: {
    label: "Webhook",
    fields: [
      { key: "url", label: "Webhook URL", type: "url", placeholder: "https://your-webhook-url.com" },
      { key: "secret", label: "Secret (Optional)", type: "password", placeholder: "webhook-secret" }
    ]
  },
  HTTP: {
    label: "HTTP API",
    fields: [
      { key: "base_url", label: "Base URL", type: "url", placeholder: "https://api.example.com" },
      { key: "api_key", label: "API Key", type: "password", placeholder: "your-api-key" },
      { key: "auth_header", label: "Auth Header", type: "text", placeholder: "Authorization" }
    ]
  },
  MONGODB: {
    label: "MongoDB",
    fields: [
      { key: "connection_string", label: "Connection String", type: "password", placeholder: "mongodb://username:password@host:port/database" }
    ]
  },
  MYSQL: {
    label: "MySQL",
    fields: [
      { key: "host", label: "Host", type: "text", placeholder: "localhost" },
      { key: "port", label: "Port", type: "text", placeholder: "3306" },
      { key: "database", label: "Database", type: "text", placeholder: "database_name" },
      { key: "username", label: "Username", type: "text", placeholder: "username" },
      { key: "password", label: "Password", type: "password", placeholder: "password" }
    ]
  },
  POSTGRESQL: {
    label: "PostgreSQL",
    fields: [
      { key: "host", label: "Host", type: "text", placeholder: "localhost" },
      { key: "port", label: "Port", type: "text", placeholder: "5432" },
      { key: "database", label: "Database", type: "text", placeholder: "database_name" },
      { key: "username", label: "Username", type: "text", placeholder: "username" },
      { key: "password", label: "Password", type: "password", placeholder: "password" }
    ]
  },
  AWS_S3: {
    label: "AWS S3",
    fields: [
      { key: "access_key_id", label: "Access Key ID", type: "text", placeholder: "AKIAIOSFODNN7EXAMPLE" },
      { key: "secret_access_key", label: "Secret Access Key", type: "password", placeholder: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" },
      { key: "region", label: "Region", type: "text", placeholder: "us-east-1" }
    ]
  },
  DROPBOX: {
    label: "Dropbox",
    fields: [
      { key: "access_token", label: "Access Token", type: "password", placeholder: "sl.your-dropbox-access-token" }
    ]
  },
  ONEDRIVE: {
    label: "OneDrive",
    fields: [
      { key: "access_token", label: "Access Token", type: "password", placeholder: "EwAIA+pvBAAUbDba3x2OMJElkwdDqYKH" }
    ]
  },
  CUSTOM: {
    label: "Custom",
    fields: [
      { key: "key1", label: "Key 1", type: "text", placeholder: "Enter key name" },
      { key: "value1", label: "Value 1", type: "password", placeholder: "Enter value" }
    ]
  }
};

export type CredentialType = keyof typeof credentialTemplates;