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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error('Microphone access error:', error);
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
      // Convert to WAV format for better compatibility
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: formData,
      });

      if (error) {
        console.error('Transcription error:', error);
        throw error;
      }

      if (data && data.success && data.transcript) {
        const transcribedText = data.transcript.trim();
        setTranscript(transcribedText);
        onTranscription?.(transcribedText);

        toast({
          title: "Voice processed",
          description: "Your voice has been transcribed successfully.",
        });
      } else {
        throw new Error('No transcript received');
      }
    } catch (error) {
      console.error('Audio processing error:', error);
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
      // Stop any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.lang = 'en-US';
      
      speechSynthesis.speak(utterance);
      
      toast({
        title: "Speaking",
        description: "Playing audio response.",
      });
    } else {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in this browser.",
        variant: "destructive"
      });
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
            className={`flex-1 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'medical-gradient hover:opacity-90 text-white'
            }`}
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
              className="border-medical-primary text-medical-primary hover:bg-medical-secondary"
              title="Play transcript"
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

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Click to start recording your symptoms or questions</p>
          <p>• Speak clearly for 3-10 seconds for best results</p>
          <p>• The AI will transcribe and analyze your voice</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceChat;