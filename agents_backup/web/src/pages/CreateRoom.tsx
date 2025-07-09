import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
type GetRoomsApiResponse = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}[]
export default function CreateRoom() {

  const {data, isLoading} = useQuery<GetRoomsApiResponse>({
    queryKey: ['getRooms'],
    queryFn: async () => {
      // Simulate an API call
      const response = await fetch('http://localhost:3333/rooms');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    },
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
    {/* <h1>Create Room</h1>
    <Link to="/room" className="text-blue-500 hover:underline">
      Go to Room
    </Link> */}
    {data && data.length > 0 ? (
      <div className="flex flex-col space-y-4">
        {data.map((room) => {
          return ( 
          <Link to={`/room/${room.id}`} key={room.id} className="">
              {room.name}
            </Link>
          )
    })}
      </div>
    ) : (
      <p>No rooms available.</p>
    )}
    </div>
    
  )
}
