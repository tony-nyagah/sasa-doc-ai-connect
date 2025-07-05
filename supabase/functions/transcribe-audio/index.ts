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
      throw new Error('Hugging Face token not configured');
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      throw new Error('No audio file provided');
    }

    // Convert audio file to base64 or binary data for HF API
    const audioBuffer = await audioFile.arrayBuffer();
    const audioArray = new Uint8Array(audioBuffer);

    // Use Hugging Face Whisper API
    const response = await fetch(
      "https://router.huggingface.co/fal-ai/fal-ai/whisper",
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: Array.from(audioArray), // Convert to array for JSON serialization
          parameters: {
            language: "en",
            task: "transcribe"
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract transcript from HF response
    let transcript = '';
    if (data && typeof data === 'object') {
      // Handle different possible response formats from HF
      if (data.text) {
        transcript = data.text;
      } else if (data.transcription) {
        transcript = data.transcription;
      } else if (Array.isArray(data) && data.length > 0 && data[0].text) {
        transcript = data[0].text;
      } else if (typeof data === 'string') {
        transcript = data;
      }
    }
    
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