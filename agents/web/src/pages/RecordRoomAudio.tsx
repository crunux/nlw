import { useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function';

type RoomParams = {
  roomId: string;
};
export default function RecordRoomAudio() {
  const params = useParams<RoomParams>();
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>(null);
  // const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  function stopRecording() {
    setIsRecording(false);
    
    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.stop();
      // recorder.current = null;
    } 

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      // intervalRef.current = null;
    }
  }
  
  async function uploadAudio(audio: Blob) {
    const formData = new FormData();
    formData.append('file', audio, 'audio.webm');
    
    const response = await fetch(`http://localhost:3333/rooms/${params.roomId}/audio`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    return data;
  }

  function createRecorder(audio: MediaStream) {
    recorder.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm', 
      audioBitsPerSecond: 64_000
    });
    
    recorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        uploadAudio(event.data)
      }
    }
    
    recorder.current.onstart = () => {
      console.log('Audio recording started');
    };
    
    recorder.current.onstop = () => {
      setIsRecording(false);
      console.log('Audio recording stopped');
    };
    
    recorder.current.start();
  }
  
  async function startRecording  () {
    
    if (!isRecordingSupported) {
      alert('Audio recording is not supported in this browser.');
      return;
    }
    
    setIsRecording(true);
    
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100,
      },
    });
    
    createRecorder(audio);

    intervalRef.current = setInterval(() => {
      recorder.current?.stop()
      createRecorder(audio);
    }, 5000);
  };
  
  if (!params.roomId) {
    return <Navigate replace to="/" />;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      {/* <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="audio">Upload Audio</Label>
        <Input id="audio" type="file" />
      </div> */}
      {isRecording ? (
        <Button onClick={stopRecording} variant="destructive">
          Stop Recording
        </Button>
      ) : (
        <Button onClick={startRecording}>Start Recording</Button>
      )}
      {isRecording ? <p>Recording...</p> : <p>Pause</p>}
    </div>
  );
}
