// getPlayerRowsFromSheet.ts
import * as cheerio from "https://esm.sh/cheerio@1.0.0";
import * as lodash from "https://esm.sh/lodash@4.17.21";

import { StaffProperties, TableResult } from "./types.ts";

const regionTableCSSSelector = ".ritz.grid-container";

const knownRegions = ["AMERICAS", "EMEA", "CN", "PACIFIC"];

export const getPlayerRowsFromSheet = (
  dataHtml: string,
): TableResult => {
  const $ = cheerio.load(dataHtml);
  const foundRegions = $(regionTableCSSSelector);

  try {
    if (foundRegions.length === 4) {
      let staffCount = 0;
      let rowEntriesLength = 0;
      let skipped = 0;
      let playersMap: Map<string, StaffProperties> = new Map();

      foundRegions.each((_index, region) => {
        // TODO: check the first row then map each of your desired columns to the correct index
        const regionTable = $(region).children("table");
        const tableBody = $(regionTable).children("tbody");
        const rowEntries = $(tableBody).children("tr");
        rowEntriesLength += rowEntries.length;
        const columnHeadersToIndexMap = new Map<string, number>();

        rowEntries.each((_rowIndex, row) => {
          const rowColumns = $(row).children("td");

          // here, we set our column here
          if (_rowIndex === 1) {
            let columnCounter = 0;
            rowColumns.each((_columnIndex, column) => {
              if ($(column).text() !== "") {
                // ? For some reason, americas has League as "mad" for some reason???
                if ($(column).text() === "mad") {
                  columnHeadersToIndexMap.set("LEAGUE", columnCounter);
                } else {
                  columnHeadersToIndexMap.set(
                    lodash.upperCase($(column).text()),
                    columnCounter,
                  );
                }
              }
              columnCounter += 1;
            });
            // TODO: use this to match up below columns to correct index
            console.log(columnHeadersToIndexMap);
          }

          if (knownRegions.includes(rowColumns.first().text())) {
            staffCount += 1;

            const playerInfoArray: string[] = [];
            rowColumns.each((_columnIndex, column) => {
              if ($(column).text() !== "") {
                playerInfoArray.push($(column).text());
              }
            });

            if ([10, 11].includes(playerInfoArray.length)) {
              if (!knownRegions.includes(playerInfoArray[0])) {
                console.log("Player region not found in known regions");
                skipped += 1;
              } else {
                const playerInfoMap = new Map<string, StaffProperties>([
                  [playerInfoArray[2], {
                    ign: playerInfoArray[2],
                    region: playerInfoArray[0] as
                      | "AMERICAS"
                      | "EMEA"
                      | "CN"
                      | "PACIFIC",
                    team: playerInfoArray[1],
                    teamTag: playerInfoArray[9],
                    role: ["PLAYER", "HEAD COACH"].includes(
                        playerInfoArray[3].toUpperCase(),
                      )
                      ? playerInfoArray[3].toUpperCase() as
                        | "PLAYER"
                        | "HEAD COACH"
                      : "ADDITIONAL STAFF",
                    firstName: lodash.capitalize(playerInfoArray[4]),
                    lastName: lodash.capitalize(playerInfoArray[5]),
                    endYear: parseInt(playerInfoArray[6]),
                    active: ["Active", "Staff"].includes(
                        lodash.capitalize(playerInfoArray[8]),
                      )
                      ? true
                      : false,
                  }],
                ]);
                playersMap = new Map([...playersMap, ...playerInfoMap]);
              }
            } // ! Special processing for flor since she doesn't have a name written down in the google sheet
            else if (playerInfoArray[2] === "florescent") {
              const playerInfoMap = new Map<string, StaffProperties>([
                [playerInfoArray[2], {
                  ign: playerInfoArray[2],
                  region: playerInfoArray[0] as
                    | "AMERICAS"
                    | "EMEA"
                    | "CN"
                    | "PACIFIC",
                  team: playerInfoArray[1],
                  teamTag: playerInfoArray[7],
                  role: ["PLAYER", "HEAD COACH"].includes(
                      playerInfoArray[3].toUpperCase(),
                    )
                    ? playerInfoArray[3].toUpperCase() as
                      | "PLAYER"
                      | "HEAD COACH"
                    : "ADDITIONAL STAFF",
                  firstName: "",
                  lastName: "",
                  endYear: parseInt(playerInfoArray[4]),
                  active: ["Active", "Staff"].includes(
                      lodash.capitalize(playerInfoArray[6]),
                    )
                    ? true
                    : false,
                }],
              ]);
              playersMap = new Map([...playersMap, ...playerInfoMap]);
            } else {
              skipped += 1;
            }
          }
        });
      });

      return {
        metadata: { playersMap, skipped, staffCount, rowEntriesLength },
      };
    } else {
      throw new Error("known regions not equal to 4");
    }
  } catch (error) {
    // more in-depth error handling might be needed in the future
    throw error;
  }
};
