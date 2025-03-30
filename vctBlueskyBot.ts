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
  /* 1) Create map of the the current list of players in the database 

});

/*
What triggers do i want that will result in a bluesky post?
- new player/staff is added and is not in the database
- a player is moved from active to reserve or vice versa
- a player is moved to a new team
- a player is removed from the database - here we have to get the names of every player in the database and compare it found names in google sheet
- contract has been extended

- for efficiency how do we prioritize these triggers?
*/


