import "jsr:@std/dotenv/load";
import { insertPlayer } from "./utils/database/index.ts";
import { getPlayerRowsFromSheet } from "./utils/scraping/index.ts";

const url = Deno.env.get("GOOGLE_SHEET_URL");
const response = await fetch(`${url}`);
const html = await response.text();

const playerMetaData = getPlayerRowsFromSheet(html);
console.log(
  `Players found: ${playerMetaData.metadata.staffCount} out of ${playerMetaData.metadata.rowEntriesLength} rows...`,
);
console.log(`Players skipped: ${playerMetaData.metadata.skipped} players...`);

const testPlayer = playerMetaData.metadata.playersMap.get("m1xwell");

if (testPlayer) {
  await insertPlayer({
    ign: testPlayer.ign,
    region: testPlayer.region,
    team: testPlayer.team,
    teamTag: testPlayer.teamTag,
    role: testPlayer.role,
    firstName: testPlayer.firstName,
    lastName: testPlayer.lastName,
    endYear: testPlayer.endYear,
    active: testPlayer.active,
  });
}
