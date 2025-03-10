import { pgTable, serial, text } from "drizzle-orm/pg-core";

// ? This is an example only!
export const players = pgTable("players", {
  id: serial().primaryKey().notNull(),
  name: text(),
  description: text(),
  newColumn: text(),
});
