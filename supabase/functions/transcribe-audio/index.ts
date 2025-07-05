const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hfToken = Deno.env.get('HF_TOKEN');
    
    if (!hfToken) {
      console.error('HF_TOKEN not found in environment variables');
      return new Response(JSON.stringify({ 
        error: 'Speech recognition is currently unavailable. Please type your message instead.',
        transcript: '',
        success: false,
        isConfigurationError: true
      }), {
        status: 200, // Return 200 to avoid triggering client-side error handling
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing audio transcription request...');

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return new Response(JSON.stringify({ 
        error: 'No audio file provided',
        transcript: '',
        success: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
    
    // If all models failed, return a user-friendly response
    console.log('All models failed, using fallback');
    return new Response(JSON.stringify({ 
      transcript: '',
      success: false,
      error: 'Speech recognition is temporarily unavailable. Please try typing your message instead.',
      isTemporaryError: true,
      lastError
    }), {
      status: 200, // Return 200 to avoid triggering client-side error handling
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in transcribe-audio function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred. Please try typing your message instead.',
      transcript: '',
      success: false,
      isUnexpectedError: true
    }), {
      status: 200, // Return 200 to avoid triggering client-side error handling
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});