import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hfToken = Deno.env.get('HF_TOKEN');
    
    if (!hfToken) {
      console.error('HF_TOKEN not found in environment variables');
      throw new Error('Hugging Face token not configured');
    }

    console.log('Processing audio transcription request...');

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      throw new Error('No audio file provided');
    }

    console.log('Audio file details:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    });

    // Convert audio to proper format for Whisper
    const audioArrayBuffer = await audioFile.arrayBuffer();
    
    // Try multiple Whisper models for better reliability
    const models = [
      "openai/whisper-base",
      "openai/whisper-small", 
      "openai/whisper-tiny"
    ];
    
    let lastError = null;
    
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            headers: {
              Authorization: `Bearer ${hfToken}`,
              "Content-Type": "audio/wav",
            },
            method: "POST",
            body: audioArrayBuffer,
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log('Transcription result:', result);
          
          let transcript = '';
          if (result && typeof result === 'object') {
            if (result.text) {
              transcript = result.text;
            } else if (Array.isArray(result) && result.length > 0) {
              transcript = result[0].text || result[0];
            }
          } else if (typeof result === 'string') {
            transcript = result;
          }
          
          transcript = transcript.trim();
          
          if (transcript) {
            console.log('Successfully transcribed:', transcript);
            return new Response(JSON.stringify({ 
              transcript,
              success: true,
              model: model
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        } else {
          const errorText = await response.text();
          console.log(`Model ${model} failed:`, response.status, errorText);
          lastError = `${model}: ${response.status} - ${errorText}`;
          
          if (response.status === 503) {
            // Model is loading, try next one
            continue;
          }
        }
      } catch (modelError) {
        console.log(`Error with model ${model}:`, modelError);
        lastError = `${model}: ${modelError.message}`;
        continue;
      }
    }
    
    // If all models failed, return a fallback response
    console.log('All models failed, using fallback');
    return new Response(JSON.stringify({ 
      transcript: '',
      success: false,
      error: 'Speech recognition temporarily unavailable. Please try typing your message instead.',
      isLoading: true,
      lastError
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in transcribe-audio function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      transcript: '',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});