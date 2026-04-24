import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  INSFORGE_URL: z.string().url(),
  INSFORGE_API_KEY: z.string().min(10),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().length(64),
  REDIS_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
// If any var is missing → clear error message → process exits