import { z } from "zod";

export const createCredentialSchema = z.object({
  name: z.string().max(30),
  type: z.enum(["GMAIL", "SLACK", "OPENAI", "NOTION", "DISCORD", "GITHUB", "GOOGLE_SHEETS", "ANTHROPIC", "HUGGING_FACE", "WEBHOOK", "HTTP", "CUSTOM"]),
  credentials: z.record(z.string(), z.string().max(500)),
});

export type createCredentialSchemaType = z.infer<typeof createCredentialSchema>;
