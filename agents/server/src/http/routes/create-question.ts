import type{ FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { db } from "../../db/connection.ts";
import { eq, desc } from "drizzle-orm";
import { schema } from "../../db/schema/index.ts";
import { id } from "zod/v4/locales";

export const createQuestionRoute: FastifyPluginCallbackZod = (fastify) => {
  fastify.post(
    "/rooms/:roomId/questions",
    {
      schema: {
        params: z.object({
            roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(1),
      }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params as { roomId: string };
      const { question } = request.body as { question: string };

      const result = await db.insert(schema.questions).values({
        question,
        roomId,
      }).returning();

      const insertedQuestion = result[0];

      if (!insertedQuestion) {
        return reply.status(500).send({ error: "Failed to create question" });
      }

      return reply.status(201).send({
        id: insertedQuestion.id,
        roomId: insertedQuestion.roomId,
        question: insertedQuestion.question,
        answer: insertedQuestion.answer,
        createdAt: insertedQuestion.createdAt.toISOString(),
      });
    }
  );
}