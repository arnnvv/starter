import { Pool } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

export const getDB = (): string =>
  process.env.DATABASE_URL ??
  ((): never => {
    throw new Error("Missing DATABASE_URL");
  })();

export const pool = new Pool({ connectionString: getDB(), ssl: true });
export const db: NeonDatabase<typeof schema> = drizzle(pool, { schema });
