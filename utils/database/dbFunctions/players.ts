import "jsr:@std/dotenv/load"; // MAKE SURE THIS IS HERE FOR ENV VARIABLES
import { InsertPlayer, playersSchema } from "../../index.ts";
import { drizzle } from "drizzle-orm/node-postgres";

// Instantiate Drizzle client with pg driver and schema.
// export const db = drizzle({
//   client: new Pool({
//     connectionString: Deno.env.get("DATABASE_URL")!,
//   }),
//   schema: { playersSchema },
//   prepare: false,
// });

export const db = drizzle(Deno.env.get("DATABASE_URL")!);

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
