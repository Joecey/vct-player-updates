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
import { main } from "./main.ts";

console.log(`VCT Player Updates bot started...`);

Deno.cron(
  "Update VCT Database and post on Bluesky",
  "*/5 * * * *", // run every five minutes
  async () => {
    console.log(LogStatus.INFO, `Running cron...`);
    await main();
  },
);
