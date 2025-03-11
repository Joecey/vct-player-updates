import "jsr:@std/dotenv/load"; // MAKE SURE THIS IS HERE FOR ENV VARIABLES
import { InsertPlayer, playersSchema } from "../../index.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// pg driver
const { Pool } = pg;

// Instantiate Drizzle client with pg driver and schema.
export const db = drizzle({
  // @ts-ignore - this has a weird error type sometimes depending on the OS
  client: new Pool({
    connectionString: Deno.env.get("DATABASE_URL")!,
  }),
  schema: { playersSchema },
  prepare: false,
});

// insert a player into the database
/**
 * @param {string} ign - the name of the player
 */
export async function insertPlayer(player: InsertPlayer) {
  console.log("Inserting player function...");
  await db.insert(playersSchema).values(player);
  console.log("Player inserted successfully! here");
}

// delete a player by ign
