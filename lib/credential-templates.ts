export const credentialTemplates = {
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
  GOOGLE_SHEETS: {
    label: "Google Sheets",
    fields: [
      { key: "client_id", label: "Client ID", type: "text", placeholder: "your-google-client-id" },
      { key: "client_secret", label: "Client Secret", type: "password", placeholder: "your-google-client-secret" }
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
  CUSTOM: {
    label: "Custom",
    fields: [
      { key: "key1", label: "Key 1", type: "text", placeholder: "Enter key name" },
      { key: "value1", label: "Value 1", type: "password", placeholder: "Enter value" }
    ]
  }
};

export type CredentialType = keyof typeof credentialTemplates;