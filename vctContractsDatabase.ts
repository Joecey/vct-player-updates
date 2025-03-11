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
import * as cheerio from "https://esm.sh/cheerio@1.0.0";

const regionTableCSSSelector = ".ritz.grid-container";

// i think we can just scrape the data? all the data is in the html!
const url = Deno.env.get("GOOGLE_SHEET_URL");
const response = await fetch(`${url}`);
const html = await response.text();

const $ = cheerio.load(html);

const foundRegions = $(regionTableCSSSelector);
const knownRegions = ["AMERICAS", "EMEA", "CN", "PACIFIC"];

if (foundRegions.length === 4) {
  console.log("Four regions found...Continuing with processing...");
  foundRegions.each((index, region) => {
    const regionTable = $(region).children("table");
    const tableBody = $(regionTable).children("tbody");
    const rowEntries = $(tableBody).children("tr");

    let playerCount = 0;

    rowEntries.each((rowIndex, row) => {
      const rowColumns = $(row).children("td");
      if (knownRegions.includes(rowColumns.first().text())) {
        playerCount += 1;

        let displayString = "";
        rowColumns.each((columnIndex, column) => {
          displayString += $(column).text() !== ""
            ? `${$(column).text()} | `
            : "";
        });
        console.log(displayString);
      }
    });

    console.log(
      `Staff count for ${
        knownRegions[index]
      }: ${playerCount} out of ${rowEntries.length} \n`,
    );
  });
} else {
  console.log("Error: Four regions not found...Google sheet has been updated!");
}
