import { Navigate, useParams } from 'react-router-dom'

type RoomParams = {
  roomId: string
}

export default function Room() {

  const roomId = useParams<RoomParams>().roomId
  if (!roomId) {
    return <Navigate to="/" replace />
  }
  return (
    <div>{roomId}</div>
  )
}
 