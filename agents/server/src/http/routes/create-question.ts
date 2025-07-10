import { and, eq, sql } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';
import { generateAnswer, generateEmbeddings } from '../../services/gemini.ts';

export const createQuestionRoute: FastifyPluginCallbackZod = (fastify) => {
  fastify.post(
    '/rooms/:roomId/questions',
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
      
      const roomExists = await db
        .select({id: schema.rooms.id})
        .from(schema.rooms)
        .where(eq(schema.rooms.id, roomId))
        .limit(1);

      if (!roomExists.length) {
        return reply.status(404).send({ error: 'Room not found' });
      }

      const embeddings = await generateEmbeddings(question);
      const embeddingsAsString = `[${embeddings.join(', ')}]`;
      const chuncks = await db.select(
        {
          id: schema.audioChucks.id,
          transcription: schema.audioChucks.transcription,
          simielarity: sql<number>`1 - (${schema.audioChucks.embeddings} <=> ${embeddingsAsString}::vector)`,
        }
      )
        .from(schema.audioChucks)
        .where(
          and(eq(schema.audioChucks.roomId, roomId), 
          sql`1 - (${schema.audioChucks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`
        ))
        .orderBy(sql`${schema.audioChucks.embeddings} <=> ${embeddingsAsString}::vector`)
        .limit(3);
      

      let answer: string | null = null ;
      if (chuncks.length > 0) {
        const transcriptions = chuncks.map((chunk) => chunk.transcription);
        answer = await generateAnswer(question, transcriptions);
      } else {
        answer = `Sorry, I couldn't find an answer to the question "${question}". Please try asking a different question or providing more context.`;
      }
        

      const result = await db
        .insert(schema.questions)
        .values({
          question,
          answer,
          roomId,
        })
        .returning();

      const insertedQuestion = result[0];

      if (!insertedQuestion) {
        return reply.status(500).send({ error: 'Failed to create question' });
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
};
