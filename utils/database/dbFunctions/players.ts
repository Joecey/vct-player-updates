import "jsr:@std/dotenv/load"; // MAKE SURE THIS IS HERE FOR ENV VARIABLES
import { InsertPlayer, playersSchema } from "../index.ts";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(Deno.env.get("DATABASE_URL")!);

// insert a player into the database
/**
 * @param {string} ign - the name of the player
 */
export async function insertPlayer(player: InsertPlayer) {
  console.log(
    `Attempting to insert player: ${player.ign} (${player.teamTag}, ${player.region})...`,
  );
  await db.insert(playersSchema).values(player);
  console.log(`Player ${player.ign} inserted successfully!`);
}

// TODO: update a player based on ign
export async function updatePlayer(player: InsertPlayer) {
  console.log(
    `Attempting to update player: ${player.ign} (${player.teamTag}, ${player.region})...`,
  );
  // await db.update(playersSchema).values(player);
  console.log(`Player ${player.ign} updated successfully!`);
}

// delete a player by ign
