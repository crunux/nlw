import RoomForm from "@/components/RoomForm";
import RoomList from "@/components/RoomList";

export default function CreateRoom() {
  

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-2 items-start gap-8">
          <RoomForm/>
          <RoomList/>
        </div>
      </div>
    </div>
  );
}
