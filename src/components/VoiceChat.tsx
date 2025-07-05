import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Loader2, AlertCircle, Keyboard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VoiceChatProps {
  onTranscription?: (text: string) => void;
}

const VoiceChat = ({ onTranscription }: VoiceChatProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isModelLoading, setIsModelLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Use a more compatible format
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
      } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly. Recording will stop automatically after 10 seconds or click stop.",
      });

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
          stopRecording();
        }
      }, 10000);
      
    } catch (error) {
      console.error('Microphone access error:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions and try again.",
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
      console.log('Processing audio blob:', audioBlob.size, 'bytes', audioBlob.type);
      
      // Check if audio is too small
      if (audioBlob.size < 1000) {
        throw new Error('Audio recording too short. Please speak for at least 2 seconds.');
      }
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: formData,
      });

      if (error) {
        console.error('Transcription error:', error);
        throw new Error('Speech recognition service is temporarily unavailable. Please try typing instead.');
      }

      console.log('Transcription response:', data);

      if (data && data.isConfigurationError) {
        setIsModelLoading(true);
        toast({
          title: "Service Unavailable",
          description: "Speech recognition is not configured. Please type your symptoms instead.",
          variant: "destructive"
        });
        return;
      }

      if (data && data.isTemporaryError) {
        setIsModelLoading(true);
        toast({
          title: "Service Temporarily Unavailable",
          description: "Speech recognition is temporarily down. Please try again later or type your symptoms.",
          variant: "destructive"
        });
        return;
      }

      if (data && data.success && data.transcript) {
        const transcribedText = data.transcript.trim();
        if (transcribedText.length > 0) {
          setTranscript(transcribedText);
          onTranscription?.(transcribedText);
          setIsModelLoading(false);

          toast({
            title: "Voice processed successfully",
            description: `Transcribed: "${transcribedText.substring(0, 50)}${transcribedText.length > 50 ? '...' : ''}"`,
          });
        } else {
          throw new Error('No speech detected. Please try speaking more clearly.');
        }
      } else {
        throw new Error('Could not process speech. Please try typing instead.');
      }
    } catch (error) {
      console.error('Audio processing error:', error);
      setIsModelLoading(false);
      
      let errorMessage = "Failed to process audio. Please try again or use the text input.";
      if (error.message?.includes('too short')) {
        errorMessage = "Recording too short. Please speak for at least 2 seconds.";
      } else if (error.message?.includes('No speech detected')) {
        errorMessage = "No speech detected. Please speak more clearly and try again.";
      } else if (error.message?.includes('temporarily unavailable')) {
        errorMessage = "Speech recognition is temporarily unavailable. Please type your symptoms instead.";
        setIsModelLoading(true);
      }
      
      toast({
        title: "Processing Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
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

  const retryRecording = () => {
    setIsModelLoading(false);
    setTranscript('');
  };

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Mic className="w-5 h-5 mr-2 text-medical-primary" />
          Voice Assistant
          {isModelLoading && (
            <AlertCircle className="w-4 h-4 ml-2 text-yellow-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isModelLoading && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center text-yellow-800">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-sm">Speech service is temporarily unavailable. Please type your symptoms instead.</span>
            </div>
            <Button 
              onClick={retryRecording}
              variant="outline"
              size="sm"
              className="mt-2 text-yellow-700 border-yellow-300"
            >
              Try Again
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || isModelLoading}
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
              disabled={isProcessing}
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
          <p>• Click to start recording (auto-stops after 10 seconds)</p>
          <p>• Speak clearly and loudly for best results</p>
          <p>• If voice doesn't work, you can type your symptoms instead</p>
          {isModelLoading && (
            <p className="text-yellow-600">• Speech service is temporarily unavailable</p>
          )}
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-400 flex items-center">
            <Keyboard className="w-3 h-3 mr-1" />
            Having trouble with voice? You can type your symptoms in the text area above.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceChat;