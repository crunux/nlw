import { pgTable, text, timestamp, uuid, vector } from 'drizzle-orm/pg-core';
import { rooms } from './rooms.ts';

export const audioChucks = pgTable('audio_chucks', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid().references(() => rooms.id).notNull(),
  transcription: text().notNull(),
  embeddings: vector({ dimensions: 768 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});
