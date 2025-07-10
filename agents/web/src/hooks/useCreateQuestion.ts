import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateQuestionRequest, CreateQuestionResponse, GetRoomQuestionResponse } from '@/types';

export const useCreateQuestion = (roomId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-question', roomId],
    mutationFn: async (data: CreateQuestionRequest) => {
      const response = await fetch(
        `http://localhost:3333/rooms/${roomId}/questions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const result: CreateQuestionResponse = await response.json();

      return result;
    },
    onMutate({ question }) {
      const questions = queryClient.getQueryData<CreateQuestionResponse[]>([
        'get-questions',
        roomId,
      ]);

      const questionArray = questions ?? [];

      const newQuestion = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        roomId,
        isGeneratingAnswer: true,
      };

      queryClient.setQueryData<GetRoomQuestionResponse>(
        ['get-questions', roomId],
        [newQuestion, ...questionArray]
      );

      return { newQuestion, questions };
    },
    onSuccess: (data, _variable, context) => {
      if (context?.questions) {
        queryClient.setQueryData<GetRoomQuestionResponse>(
          ['get-questions', roomId],
          (questions) => {
            if (!questions) {
              return questions;
            }
            if (!context.newQuestion) {
              return questions;
            }
            return questions.map((question) => {
              if (question.id === context.newQuestion.id) {
                return {
                  ...context.newQuestion, 
                  id: data.id, 
                  createdAt: data.createdAt, 
                  answer: data.answer, 
                  isGeneratingAnswer: false
                };
              }
              return question;
            });
          }
        );
      }
    },
    onError: (_error, _variable, context) => {
      if (context?.questions) {
        queryClient.setQueryData<CreateQuestionResponse[]>(
          ['get-questions', roomId],
          context.questions
        );
      }
    },
    //   queryClient.invalidateQueries({ queryKey: ['get-questions', roomId] });
    // },
  });
};
