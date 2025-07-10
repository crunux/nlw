import { useRoomQuestions } from '@/hooks/useRoomQuestions';
import { QuestionItem } from './QuestionItem';

interface QuestionListProps {
  roomId: string;
}

export default function QuestionList({ roomId }: QuestionListProps) {
  const { data } = useRoomQuestions(roomId);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-foreground">Ask & Answer</h2>
      </div>

      {data?.map((question) => {
          return (
            <QuestionItem
              key={question.id}
              question={question}
            />
          )
        }
      )}
    </div>
  );
}
