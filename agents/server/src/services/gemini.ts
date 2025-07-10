import { GoogleGenAI } from '@google/genai';
import { env } from '../env.ts';

const gemini = new GoogleGenAI({
  apiKey: env.GOOGLE_GENAI_API_KEY,
  // model: 'gemini-2.5-flash',
  // temperature: 0.2,
  // maxOutputTokens: 1024,
  // topP: 0.8,
  // topK: 40,
  // responseModel: 'chat',
  // responseFormat: 'text',
  // responseLanguage: 'en',
  // responseMode: 'streaming',
});

const model = 'gemini-2.5-flash';

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: 'Transcribe the following audio to United States English, Be accurate and natural in your transcription. Maintain proper punctuation and divide the text into paragraphs as appropriate.',
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64,
        },
      },
    ],
  });

  if (!response.text) {
    throw new Error('Error transcribing audio');
  }

  return response.text;
}

export async function generateEmbeddings(
  text: string
) {
  const response = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: [
      {
        text,
      },
    ],
    config:{
      taskType: 'RETRIEVAL_DOCUMENT',
    }
  });

  if (!response.embeddings?.[0].values) {
    throw new Error('Error generating embeddings');
  }

  return response.embeddings[0].values;
}


export async function generateAnswer(
  question: string,
  transcription: string[]
) {
  const context = transcription.join('\n\n');

  const prompt = `You are an AI assistant that answers questions based on the provided context. Use the context to answer the question accurately and concisely. If the context does not provide enough information, state that you do not know the answer.
  
  
  CONTEXT:
  ${context}
  
  QUESTION:
  ${question}

  INTRUCTIONS:
  - Answer the question based on the context provided;
  - If the context does not provide enough information, state that you do not know the answer;
  - Be concise and to the point;
  - Use proper punctuation and grammar;
  - Maintain an educational and professional tone;
  - Cite relevant excerpts from the context if appropriate;
  - If you are going to cite the context, use the term "room content";
  `.trim();

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  });

  if (!response.text) {
    throw new Error('Error generating answer');
  }

  return response.text;
}