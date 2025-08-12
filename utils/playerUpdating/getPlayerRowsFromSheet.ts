// getPlayerRowsFromSheet.ts
import "jsr:@std/dotenv/load";
import * as cheerio from "cheerio";
import * as lodash from "lodash";

import { StaffProperties, TableResult } from "./types.ts";
import { LogStatus } from "../logStatus.ts";

const regionTableCSSSelector = ".ritz.grid-container";

const knownRegions = ["AMERICAS", "EMEA", "CN", "PACIFIC"];

export const getPlayerRowsFromSheet = async (): Promise<TableResult> => {
  const url = Deno.env.get("GOOGLE_SHEET_URL");

  if (!url) throw `${LogStatus.ERROR}: Missing URL`;

  const $ = await cheerio.fromURL(url);

  const foundRegions = $(regionTableCSSSelector);
  console.log(foundRegions.text());

  // TODO: need to get the regions by tab name instead if possible - then treat them as separate things
  let staffCount = 0;
  let rowEntriesLength = 0;
  let skipped = 0;
  let playersMap: Map<string, StaffProperties> = new Map();

  //TODO: I know the problem now. Unknown when, but google public sheets are now loading client side instead of server side. This means
  //TODO: i can't get the correct info from the initial page load as a hydrates

  try {
    foundRegions.each((_index, region) => {
      return;
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
  } catch (error) {
    // more in-depth error handling might be needed in the future
    throw error;
  }
};
