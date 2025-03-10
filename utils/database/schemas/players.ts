import { boolean, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";

export const regionEnum = pgEnum("region", [
  "AMERICAS",
  "EMEA",
  "CN",
  "PACIFIC",
]);

export const teamRoles = pgEnum("role", [
  "PLAYER",
  "HEAD COACH",
  "ASSISTANT COACH",
]);

export const playersSchema = pgTable("vct_players", {
  ign: text().notNull().unique().primaryKey(),
  region: regionEnum().notNull(),
  team: text().notNull(),
  teamTag: text().notNull(),
  role: teamRoles(),
  firstName: text(),
  lastName: text(),
  endYear: integer(),
  active: boolean().notNull().default(false),
});
