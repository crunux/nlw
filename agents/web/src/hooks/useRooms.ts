import { useQuery } from '@tanstack/react-query';
import type { GetRoomsApiResponse } from '@/types';

export const useRooms = () => {
  return useQuery<GetRoomsApiResponse>({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      // Simulate an API call
      const response = await fetch('http://localhost:3333/rooms');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });
};
