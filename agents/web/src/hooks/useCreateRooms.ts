import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateRoomRequest, CreateRoomResponse } from '@/types';

export const useCreateRooms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-rooms'],
    mutationFn: async (data: CreateRoomRequest) => {
      const response = await fetch('http://localhost:3333/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }
      
      const result: CreateRoomResponse =  await response.json();

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-rooms'] });
    },
  });
  
};
