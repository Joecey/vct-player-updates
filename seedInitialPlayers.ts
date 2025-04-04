/**
 * This script seeds your newly created database with the initial players from the Google Sheet.
 * If there are already existing players in the database, this script will not insert them again.
 *
 * Written and maintained by Joe Linogao (@joedoescoding.com)
 * 2025 - Present
 */

import "jsr:@std/dotenv/load";
import { insertPlayer } from "./utils/database/index.ts";
import { getPlayerRowsFromSheet } from "./utils/playerUpdating/index.ts";

const url = Deno.env.get("GOOGLE_SHEET_URL");
const response = await fetch(`${url}`);
const html = await response.text();

const playerMetaData = getPlayerRowsFromSheet(html);
console.log(
  `Players found: ${playerMetaData.metadata.staffCount} out of ${playerMetaData.metadata.rowEntriesLength} rows...`,
);
console.log(`Players skipped: ${playerMetaData.metadata.skipped} players...`);

const foundPlayersKeys = playerMetaData.metadata.playersMap.keys();
let success = 0;
for (const key of foundPlayersKeys) {
  try {
    const player = playerMetaData.metadata.playersMap.get(key);
    if (player) {
      await insertPlayer({
        ign: player.ign,
        region: player.region,
        team: player.team,
        teamTag: player.teamTag,
        role: player.role,
        firstName: player.firstName,
        lastName: player.lastName,
        endYear: player.endYear,
        active: player.active,
      });
    }
    success += 1;
  } catch (e) {
    console.error(`Error inserting player: ${key} - ${e}`);
  }
}
console.log(
  `Inserted ${success} players out of ${playerMetaData.metadata.staffCount}!`,
);
