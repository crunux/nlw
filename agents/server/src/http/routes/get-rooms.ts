import type{ FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { count, eq } from "drizzle-orm";

export const getRoomsRoute: FastifyPluginCallbackZod = (fastify) => {
  fastify.get(
    "/rooms",
    async (request, reply) => {
      const results = await db.select(
        {
          id: schema.rooms.id,
          name: schema.rooms.name,
          description: schema.rooms.description,
          createdAt: schema.rooms.createdAt,
          questionsCount: count(schema.questions.id),
        }
      ).from(schema.rooms)
      .leftJoin(schema.questions, eq(schema.questions.roomId, schema.rooms.id))
      .groupBy(schema.rooms.id)
      .orderBy(schema.rooms.createdAt);

      return reply.send(results);

    }
  );
}