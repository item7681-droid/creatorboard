import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { requireEnv } from "@/lib/env";

export function getDb() {
  const url = requireEnv("DATABASE_URL");
  const sql = neon(url);
  return drizzle(sql, { schema });
}
