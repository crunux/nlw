import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  GOOGLE_GENAI_API_KEY: z.string().min(1, "GOOGLE_GENAI_API_KEY is required"),
  //   NODE_ENV: z
  //     .enum(["development", "production", "test"])
  //     .default("development"),
  //   DATABASE_URL: z.string().url(),
  //   JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  //   OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  //   OPENAI_API_BASE_URL: z.string().url().default("https://api.openai.com"),
  //   OPENAI_API_VERSION: z.string().default("2023-05-15"),
  //   OPENAI_API_TIMEOUT: z.coerce.number().default(60000), // 60000 ms
  //   OPENAI_API_MAX_RETRIES: z.coerce.number().default(3),
});

export const env = envSchema.parse(process.env);
