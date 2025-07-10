import { useQuery } from '@tanstack/react-query';
import type { GetRoomQuestionResponse } from '@/types';

export const useRoomQuestions = (roomId: string) => {
  return useQuery({
    queryKey: ['get-questions', roomId],
    queryFn: async () => {
      // Simulate an API call
      const response = await fetch(
        `http://localhost:3333/rooms/${roomId}/questions`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const results: GetRoomQuestionResponse = await response.json();
      return results;
    },
    refetchOnWindowFocus: false,
  });
};
