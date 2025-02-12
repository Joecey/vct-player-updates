/**
 * WIP
 * This script automates the process of collecting player updates from the
 * Valorant Champions Tour (VCT) Global Database and storing them in the
 * database and / or displaying them on a historgraph (unsure what i want to do with it yet)
 *
 * Written and maintained by Joe Linogao (@joedoescoding.com)
 * 2025 - Present
 */

import "jsr:@std/dotenv/load";

const url = `https://sheets.googleapis.com/v4/spreadsheets/${
  Deno.env.get("GOOGLE_SHEET_ID")
}/values/Sheet1?key=${Deno.env.get("GOOGLE_API_KEY")}`;

const response = await fetch(url);
const data = await response.json();
console.log(data);
