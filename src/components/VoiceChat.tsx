import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VoiceChatProps {
  onTranscription?: (text: string) => void;
}

const VoiceChat = ({ onTranscription }: VoiceChatProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: formData,
      });

      if (error) throw error;

      const transcribedText = data.transcript;
      setTranscript(transcribedText);
      onTranscription?.(transcribedText);

      toast({
        title: "Voice processed",
        description: "Your voice has been transcribed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Mic className="w-5 h-5 mr-2 text-medical-primary" />
          Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`flex-1 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'medical-gradient hover:opacity-90'}`}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-4 h-4 mr-2" />
            ) : (
              <Mic className="w-4 h-4 mr-2" />
            )}
            {isProcessing ? 'Processing...' : isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          
          {transcript && (
            <Button
              onClick={() => speakText(transcript)}
              variant="outline"
              className="border-medical-primary text-medical-primary"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {transcript && (
          <div className="p-3 bg-medical-secondary rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Transcription:</strong> {transcript}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Click to start recording your symptoms or questions. The AI will transcribe and analyze your voice.
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceChat;