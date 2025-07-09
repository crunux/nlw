import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
// export type Room = typeof rooms.$inferSelect;
// export type NewRoom = typeof rooms.$inferInsert;
// export type UpdateRoom = typeof rooms.$inferUpdate;
// export type RoomWithId = Room & { id: number };
