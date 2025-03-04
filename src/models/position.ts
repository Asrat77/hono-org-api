import { pgTable, uuid, varchar, text, AnyPgColumn } from "drizzle-orm/pg-core";

export const positions = pgTable("positions", {
  id: uuid("id").primaryKey().defaultRandom(), // GUID
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  parentId: uuid("parent_id").references((): AnyPgColumn => positions.id, {
    onDelete: "set null",
  }),
});
