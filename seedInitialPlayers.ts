import "jsr:@std/dotenv/load";
import { insertPlayer } from "./utils/database/index.ts";
import { getPlayerRowsFromSheet } from "./utils/scraping/index.ts";
import { KnownError, TableResult } from "./utils/scraping/index.ts";

const url = Deno.env.get("GOOGLE_SHEET_URL");
const response = await fetch(`${url}`);
const html = await response.text();

const playerMetaData = getPlayerRowsFromSheet(html);
// console.log(playerMetaData);
console.log(playerMetaData.metadata.playersMap.size);

// console.log("Inserting player...");
// await insertPlayer({
//   ign: "Joece4",
//   region: "EMEA",
//   team: "Fnatic",
//   teamTag: "FNC",
//   role: "PLAYER",
//   firstName: "Joe",
//   lastName: "Linogao",
//   endYear: 2026,
//   active: true,
// });
// console.log("Player inserted successfully!");
