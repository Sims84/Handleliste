import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

// Only load dotenv when not in Replit (local development)
// In Replit, environment variables are managed through Replit Secrets
if (!process.env.REPL_ID) {
  try {
    const dotenv = await import("dotenv");
    const { fileURLToPath } = await import("url");
    const { dirname, join } = await import("path");
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    dotenv.config({ path: join(__dirname, "../.env") });
  } catch (error) {
    console.warn("Could not load .env file (this is normal in Replit):", error);
  }
}

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
