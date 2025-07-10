import { fastifyCors } from '@fastify/cors';
import { fastifyMultipart } from '@fastify/multipart';
import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from './env.ts';
import { createQuestionRoute } from './http/routes/create-question.ts';
import { createRoomsRoute } from './http/routes/create-room.ts';
import { getRoomsQuestions } from './http/routes/get-room-question.ts';
import { getRoomsRoute } from './http/routes/get-rooms.ts';
import { uploadAudioRoute } from './http/routes/upload-audio.ts';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //   allowedHeaders: ["Content-Type", "Authorization"],
  //   exposedHeaders: ["Content-Type", "Authorization"],
  //   credentials: true,
});

app.register(fastifyMultipart);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get('/health', () => {
  return { status: 'OK' };
});

app.get('/', () => {
  return { message: 'Hello, world!' };
});

app.register(getRoomsRoute);
app.register(createRoomsRoute);
app.register(getRoomsQuestions);
app.register(createQuestionRoute);
app.register(uploadAudioRoute);

app.listen({ port: env.PORT });
