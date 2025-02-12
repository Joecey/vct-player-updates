/**
 * This script automates the process of posting player updates from the
 * Valorant Champions Tour (VCT) Global Database to Bluesky.
 *
 * Written and maintained by Joe Linogao (@joedoescoding.com)
 * 2025 - Present
 */

console.log(`VCT Player Updates bot started...`);

Deno.cron("Log a message", "*/5 * * * *", () => {
  console.log(`This will print every fifth minute.`);
});
