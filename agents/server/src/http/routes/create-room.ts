import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';

const CreateRoomRequest = {
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
  }),
  response: {
    201: z.object({
      roomId: z.string().uuid(),
    }),
  },
};

export const createRoomsRoute: FastifyPluginCallbackZod = (fastify) => {
  fastify.post(
    '/rooms',
    {
      schema: CreateRoomRequest,
    },
    async (request, reply) => {
      const { name, description } = request.body as z.infer<
        typeof CreateRoomRequest.body
      >;

      const result = await db
        .insert(schema.rooms)
        .values({
          name,
          description,
        })
        .returning();

      const insertedRoom = result[0];

      if (!insertedRoom) {
        return reply.status(500).send({ error: 'Failed to create room' });
      }

      return reply.status(201).send({
        roomId: insertedRoom.id,
      });
    }
  );
};
