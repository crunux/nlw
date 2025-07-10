import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';
import { generateEmbeddings, transcribeAudio } from '../../services/gemini.ts';

export const uploadAudioRoute: FastifyPluginCallbackZod = (fastify) => {
  fastify.post(
    '/rooms/:roomId/audio',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        
      },
    },
    async (request, reply) => {
      const { roomId } = request.params as { roomId: string };

      const audio = await request.file();
      
      if (!audio) {
        return reply.status(400).send({ error: 'Audio file is required' });
      }

      const audioBuffer = await audio.toBuffer();
      const audioAsBase64 = audioBuffer.toString('base64');

      const transcription = await transcribeAudio(audioAsBase64, audio.mimetype)
      const embeddings = await generateEmbeddings(transcription);

      const chuck = await db.insert(schema.audioChucks).values({
        roomId,
        transcription,
        embeddings,
      }).returning();

      if (!chuck) {
        return reply.status(500).send({ error: 'Failed to save audio chunk' });
      }



      return reply.status(201).send({
        id: chuck[0].id
      });
    }
  );
};