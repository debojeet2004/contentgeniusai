import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/index";

config({
  path: ".env",
  // debug: true,
  override: true,
});

export const db = drizzle(process.env.DATABASE_DIRECT_URL!, {
  schema,
  logger: true,
});
