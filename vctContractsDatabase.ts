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
import { getPlayerRowsFromSheet } from "./utils/scraping/index.ts";

// i think we can just scrape the data? all the data is in the html!
const url = Deno.env.get("GOOGLE_SHEET_URL");
const response = await fetch(`${url}`);
const html = await response.text();
