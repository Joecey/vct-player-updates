/**
 * This script automates the process of posting player updates from the
 * Valorant Champions Tour (VCT) Global Database to Bluesky.
 *
 * Written and maintained by Joe Linogao (@joedoescoding.com)
 * 2025 - Present
 */

import "jsr:@std/dotenv/load";
import { getPlayerRowsFromSheet } from "./utils/playerUpdating/index.ts";
import { LogStatus } from "./utils/logStatus.ts";
import {
  playerActiveStatusChanged,
  playerAdded,
  playerContractUpdated,
  playerRemoved,
  playerRoleChanged,
  playerTeamChanged,
} from "./utils/atproto/index.ts";

console.log(`VCT Player Updates bot started...`);

Deno.cron("Log a message", "*/5 * * * *", async () => {
  console.log(LogStatus.INFO, `Starting VCT Player Updates bot...`);
  /* 1) Create map of the the current list of players in the database */
  const url = Deno.env.get("GOOGLE_SHEET_URL");
  const response = await fetch(`${url}`);
  const html = await response.text();

  const playerMetaData = getPlayerRowsFromSheet(html);
  const googleSheetPlayerTruth = playerMetaData.metadata.playersMap;

  console.log(
    LogStatus.INFO,
    `Players found: ${playerMetaData.metadata.staffCount} out of ${playerMetaData.metadata.rowEntriesLength} rows...`,
  );

  console.log(
    LogStatus.INFO,
    `Players skipped: ${playerMetaData.metadata.skipped} players...`,
  );

  /* 2) Get every player ign from database and cross reference with google sheet player map. If a player is not on the
  google sheet, record this and create a new playerRemoved post for bluesky. If a player is on the google sheet, make note
  of this too
  */

  /* 3) For every player identified as still existing, check through each player using the ign and check the following:
  - NOTE: EACH CHECK NEEDS THE PREVIOUS CHECK TO NOT BE TRUE (prevent multiple posts for the same player)
  - has their team changed? if so, make a new post (playerTeamChanged)
  - has their active status changed? If so, make a new post (playerActiveStatusChanged)
  - has their role changed? if so, make a new post (playerRoleChanged)
  - has their contract been extended? if so, make a new post (playerContractUpdated)
  */

  /* 4) in the google sheet map, if a player has not been identified at all, it means that they are a new player.
  Create a new playerAdded post for bluesky and add them to the database as a new entry. */

  /* 5) Gather all posts, and post on bluesky */
});
