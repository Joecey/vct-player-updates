// this is a playground for testing the code

import { insertPlayer } from "./utils/database/index.ts";
import { getPlayerRowsFromSheet } from "./utils/scraping/index.ts";

// create a new player

console.log("Inserting player...");
await insertPlayer({
  ign: "Joece4",
  region: "EMEA",
  team: "Fnatic",
  teamTag: "FNC",
  role: "PLAYER",
  firstName: "Joe",
  lastName: "Linogao",
  endYear: 2026,
  active: true,
});
console.log("Player inserted successfully!");
