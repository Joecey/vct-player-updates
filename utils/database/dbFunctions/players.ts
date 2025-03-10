import { playersSchema } from "../../index.ts";

import { drizzle } from "drizzle-orm/node-postgresql";
import pg from "pg";

// pg driver
const { Pool } = pg;

// Instantiate Drizzle client with pg driver and schema.
export const db = drizzle({
  client: new Pool({
    connectionString: Deno.env.get("DATABASE_URL"),
  }),
  schema: { playersSchema },
});

// insert a player into the database
export const insertPlayer = async (player: typeof playersSchema) => {
  return await db.insert(playersSchema).values(player);
};

// delete a player by ign
