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
        // check the first row then map each of your desired columns to the correct index
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
          }

          if (knownRegions.includes(rowColumns.first().text())) {
            staffCount += 1;

            const playerInfoArray: string[] = [];
            rowColumns.each((_columnIndex, column) => {
              // here, create an array with raw information from player's row
              playerInfoArray.push($(column).text());
            });

            if (
              !knownRegions.includes(
                playerInfoArray[
                  columnHeadersToIndexMap.get("LEAGUE") as number
                ],
              )
            ) {
              console.error("Player region not found in known regions");
              skipped += 1;
            } else if (
              playerInfoArray[
                columnHeadersToIndexMap.get(
                  "OFFICIAL TOURNAMENT HANDLE",
                ) as number
              ] === ""
            ) {
              console.error("Player IGN not found");
              skipped += 1;
            } else {
              const leagueIndex = columnHeadersToIndexMap.get("LEAGUE");
              const teamIndex = columnHeadersToIndexMap.get("TEAM");
              const ignIndex = columnHeadersToIndexMap.get(
                "OFFICIAL TOURNAMENT HANDLE",
              );
              const roleIndex = columnHeadersToIndexMap.get("ROLE");
              const legalFirstNameIndex = columnHeadersToIndexMap.get(
                "LEGAL FIRST NAME",
              );
              const legalFamilyNameIndex = columnHeadersToIndexMap.get(
                "LEGAL FAMILY NAME",
              );
              const endYearIndex = columnHeadersToIndexMap.get(
                "END DATE MONTH DAY YEAR",
              );
              const residentStatusIndex = columnHeadersToIndexMap.get(
                "RESIDENT STATUS",
              );
              const rosterStatusIndex = columnHeadersToIndexMap.get(
                "ROSTER STATUS",
              );
              const teamTagIndex = columnHeadersToIndexMap.get("TEAM TAG");

              if (
                leagueIndex === undefined ||
                teamIndex === undefined ||
                ignIndex === undefined ||
                roleIndex === undefined ||
                legalFirstNameIndex === undefined ||
                legalFamilyNameIndex === undefined ||
                endYearIndex === undefined ||
                residentStatusIndex === undefined ||
                rosterStatusIndex === undefined ||
                teamTagIndex === undefined
              ) {
                console.error("Missing column headers - skipping");
                skipped += 1;
              } else {
                const convertedPlayerRole = lodash.trim(
                  playerInfoArray[roleIndex]
                    .toUpperCase().replace("ASSISTANT", "").replace(
                      "RESERVE",
                      "",
                    )
                    .replace("ACTIVE", ""),
                );

                const playerInfoMap = new Map<string, StaffProperties>([
                  [playerInfoArray[ignIndex], {
                    ign: playerInfoArray[ignIndex],
                    region: playerInfoArray[leagueIndex] as
                      | "AMERICAS"
                      | "EMEA"
                      | "CN"
                      | "PACIFIC",
                    team: playerInfoArray[teamIndex],
                    teamTag: playerInfoArray[teamTagIndex],
                    role: ["PLAYER", "HEAD COACH"].includes(
                        convertedPlayerRole,
                      )
                      ? convertedPlayerRole as
                        | "PLAYER"
                        | "HEAD COACH"
                      : "ADDITIONAL STAFF",
                    firstName: lodash.capitalize(
                      playerInfoArray[legalFirstNameIndex],
                    ),
                    lastName: lodash.capitalize(
                      playerInfoArray[legalFamilyNameIndex],
                    ),
                    endYear: parseInt(playerInfoArray[endYearIndex]),
                    active: ["Active", "Staff"].includes(
                        lodash.capitalize(playerInfoArray[rosterStatusIndex]),
                      )
                      ? true
                      : false,
                  }],
                ]);
                playersMap = new Map([...playersMap, ...playerInfoMap]);
              }
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
