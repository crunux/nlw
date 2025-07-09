import type{ FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { db } from "../../db/connection.ts";
import { eq, desc } from "drizzle-orm";
import { schema } from "../../db/schema/index.ts";

export const getRoomsQuestions: FastifyPluginCallbackZod = (fastify) => {
  fastify.get(
    "/rooms/:roomId/questions",
    {
      schema: {
        params: z.object({
            roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params as { roomId: string };
      if (!roomId) {
        return reply.status(400).send({ error: "Room ID is required" });
      }
      const results = await db.select({
          id: schema.questions.id,
          question: schema.questions.question,
          // roomId: schema.questions.roomId,
          answer: schema.questions.answer,
          createdAt: schema.questions.createdAt
      }).from(schema.questions).where(eq(schema.questions.roomId, roomId)).orderBy(desc(schema.questions.createdAt));

      return reply.status(200).send(results);

    }
  );
}