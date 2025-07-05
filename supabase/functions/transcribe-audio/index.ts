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

    console.log('HF Token configured successfully');

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      throw new Error('No audio file provided');
    }

    console.log('Audio file received:', audioFile.name, audioFile.size, 'bytes');

    // Convert audio file to ArrayBuffer for processing
    const audioBuffer = await audioFile.arrayBuffer();
    
    // Use Hugging Face Automatic Speech Recognition API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/octet-stream",
        },
        method: "POST",
        body: audioBuffer,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      
      // If model is loading, return a helpful message
      if (response.status === 503) {
        return new Response(JSON.stringify({ 
          transcript: '',
          success: false,
          error: 'Speech recognition model is loading. Please try again in a few moments.',
          isLoading: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('HF API response:', data);
    
    // Extract transcript from HF response
    let transcript = '';
    if (data && typeof data === 'object') {
      if (data.text) {
        transcript = data.text;
      } else if (Array.isArray(data) && data.length > 0 && data[0].text) {
        transcript = data[0].text;
      } else if (typeof data === 'string') {
        transcript = data;
      }
    }
    
    // Clean up the transcript
    transcript = transcript.trim();
    
    console.log('Extracted transcript:', transcript);
    
    return new Response(JSON.stringify({ 
      transcript: transcript || '',
      success: true 
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