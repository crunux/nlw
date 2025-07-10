export type GetRoomsApiResponse = {
  id: string;
  name: string;
  questionsCount: number;
  description: string;
  createdAt: string;
}[];

export type CreateRoomRequest = {
  name: string;
  description?: string;
};

export type CreateRoomResponse = {
  roomId: string;
};

export type GetRoomQuestionResponse = {
  id: string;
  question: string;
  answer: string | null;
  createdAt: string;
  isGeneratingAnswer?: boolean;
}[];

export type CreateQuestionRequest = {
  question: string;
};

export type CreateQuestionResponse = {
  id: string;
  roomId: string;
  question: string;
  answer: string | null;
  createdAt: string;
};
