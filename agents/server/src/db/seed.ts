import { reset, seed } from "drizzle-seed";
import { db, sql } from "./connection.ts";
import { schema } from "./schema/index.ts";

await reset(db, schema );

await seed(db, schema).refine((seed) => {
  return {
    rooms: {
      count: 5,
      columns: {
        name: seed.companyName(),
        description: seed.loremIpsum(),
      },
    },
    questions: {
      count: 20,
    },
  }
});
await sql.end();

// biome-ignore lint/suspicious/noConsole: This is a seed script, only used in dev
console.log("Database seeded successfully.");
