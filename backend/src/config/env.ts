import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(20),
  PORT: z.coerce.number().default(3333),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  FOUNDRY_BASE_URL: z.string().optional(),
  FOUNDRY_API_KEY: z.string().optional(),
  MERCADO_PAGO_ACCESS_TOKEN: z.string().optional(),
  MERCADO_PAGO_WEBHOOK_SECRET: z.string().optional(),
  PAYMENT_SUCCESS_URL: z.string().default('http://localhost:5173/pagamento-sucesso.html'),
  PAYMENT_FAILURE_URL: z.string().default('http://localhost:5173/marketplace.html'),
  PAYMENT_PENDING_URL: z.string().default('http://localhost:5173/marketplace.html')
});

export const env = envSchema.parse(process.env);
