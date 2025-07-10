import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRooms } from '@/hooks/useRooms';
import { dayjs } from '@/lib/dayjs';
import { Badge } from './ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

export default function RoomList() {
  const { data, isLoading } = useRooms();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-2xl">Recents Rooms</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Fast access to your recent created rooms.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading && (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Loading rooms...</p>
          </div>
        )}
        {data?.map((room) => {
          return (
            <Link
              className="flex items-center justify-between rounded-lg border p-3 shadow transition-colors hover:bg-accent"
              key={room.id}
              to={`/room/${room.id}`}
            >
              <div className="flex flex-1 flex-col gap-1">
                <h3>{room.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge className="text-xs" variant="secondary">
                    {dayjs(room.createdAt).toNow()}
                  </Badge>
                  <Badge className="text-xs" variant="secondary">
                    {room.questionsCount} question(s)
                  </Badge>
                </div>
              </div>
              <span className="flex items-center gap-1 text-gray-500 text-sm">
                Enter
                <ArrowRight className="size-3" />
              </span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
