
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
    const { symptoms, userType = 'patient' } = await req.json();
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');

    if (!mistralApiKey) {
      throw new Error('Mistral API key not configured');
    }

    const systemPrompt = `You are a medical AI assistant helping ${userType}s analyze symptoms. Provide:
1. Possible conditions (with likelihood: high/medium/low)
2. Self-care recommendations 
3. When to seek medical attention
4. Recommended medical specialty to consult

Format your response as JSON with these keys:
- possibleConditions: array of {condition, likelihood, description}
- selfCareRecommendations: array of practical advice
- urgencyLevel: "immediate", "within_24_hours", "within_week", or "routine"
- recommendedSpecialty: string (matching our specialties)
- disclaimer: medical disclaimer text

Be thorough but not alarming. Always recommend consulting healthcare professionals.`;

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mistralApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze these symptoms: ${symptoms}` }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    
    // Try to parse as JSON, fallback to structured text
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch {
      // If JSON parsing fails, create a structured response
      parsedAnalysis = {
        possibleConditions: [{ condition: "Analysis needed", likelihood: "unknown", description: analysis }],
        selfCareRecommendations: ["Consult with a healthcare professional for proper diagnosis"],
        urgencyLevel: "routine",
        recommendedSpecialty: "General Medicine",
        disclaimer: "This analysis is for informational purposes only and should not replace professional medical advice."
      };
    }

    return new Response(JSON.stringify(parsedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-symptoms function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
