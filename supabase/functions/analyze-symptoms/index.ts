import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Specialty mapping for better AI recommendations
const specialtyMapping = {
  'heart': 'Cardiology',
  'cardiac': 'Cardiology',
  'chest pain': 'Cardiology',
  'blood pressure': 'Cardiology',
  'skin': 'Dermatology',
  'rash': 'Dermatology',
  'acne': 'Dermatology',
  'eczema': 'Dermatology',
  'brain': 'Neurology',
  'headache': 'Neurology',
  'migraine': 'Neurology',
  'seizure': 'Neurology',
  'mental': 'Psychiatry',
  'depression': 'Psychiatry',
  'anxiety': 'Psychiatry',
  'stress': 'Psychiatry',
  'bone': 'Orthopedics',
  'joint': 'Orthopedics',
  'fracture': 'Orthopedics',
  'arthritis': 'Orthopedics',
  'child': 'Pediatrics',
  'infant': 'Pediatrics',
  'baby': 'Pediatrics',
  'pregnancy': 'Gynecology',
  'menstrual': 'Gynecology',
  'reproductive': 'Gynecology'
};

function getRecommendedSpecialty(symptoms: string): string {
  const lowerSymptoms = symptoms.toLowerCase();
  
  for (const [keyword, specialty] of Object.entries(specialtyMapping)) {
    if (lowerSymptoms.includes(keyword)) {
      return specialty;
    }
  }
  
  return 'General Medicine';
}

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

    // Get AI-recommended specialty
    const aiRecommendedSpecialty = getRecommendedSpecialty(symptoms);

    const systemPrompt = `You are a medical AI assistant helping ${userType}s analyze symptoms. 

IMPORTANT: You MUST respond with valid JSON only. Do not include any text before or after the JSON.

Based on the symptoms provided, recommend the most appropriate medical specialty from this list:
- General Medicine
- Cardiology  
- Dermatology
- Pediatrics
- Orthopedics
- Neurology
- Psychiatry
- Gynecology

Consider the symptoms carefully and match them to the most relevant specialty. If unsure, default to "General Medicine".

Provide a JSON response with these exact keys:
- possibleConditions: array of {condition, likelihood, description} where likelihood is "high", "medium", or "low"
- selfCareRecommendations: array of practical advice strings
- urgencyLevel: one of "immediate", "within_24_hours", "within_week", or "routine"
- recommendedSpecialty: string matching one of the specialties listed above
- disclaimer: medical disclaimer text

Example format:
{
  "possibleConditions": [
    {"condition": "Common Cold", "likelihood": "high", "description": "Viral infection causing respiratory symptoms"}
  ],
  "selfCareRecommendations": ["Rest and stay hydrated"],
  "urgencyLevel": "routine",
  "recommendedSpecialty": "General Medicine",
  "disclaimer": "This analysis is for informational purposes only and should not replace professional medical advice."
}

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
          { role: 'user', content: `Analyze these symptoms and recommend the appropriate medical specialty: ${symptoms}` }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    let analysis = data.choices[0].message.content.trim();
    
    // Clean up the response - remove any markdown formatting or extra text
    if (analysis.includes('```json')) {
      analysis = analysis.split('```json')[1].split('```')[0].trim();
    } else if (analysis.includes('```')) {
      analysis = analysis.split('```')[1].split('```')[0].trim();
    }
    
    // Try to parse as JSON
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
      
      // Validate the structure
      if (!parsedAnalysis.possibleConditions || !Array.isArray(parsedAnalysis.possibleConditions)) {
        throw new Error('Invalid response structure');
      }
      
      // Ensure all required fields exist and use fallback specialty if needed
      parsedAnalysis = {
        possibleConditions: parsedAnalysis.possibleConditions || [],
        selfCareRecommendations: parsedAnalysis.selfCareRecommendations || [],
        urgencyLevel: parsedAnalysis.urgencyLevel || "routine",
        recommendedSpecialty: parsedAnalysis.recommendedSpecialty || aiRecommendedSpecialty,
        disclaimer: parsedAnalysis.disclaimer || "This analysis is for informational purposes only and should not replace professional medical advice."
      };
      
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError, 'Raw response:', analysis);
      
      // Create a structured fallback response with intelligent specialty recommendation
      parsedAnalysis = {
        possibleConditions: [
          {
            condition: "Symptom Analysis Required", 
            likelihood: "medium", 
            description: "Based on your symptoms, a medical evaluation is recommended for proper diagnosis."
          }
        ],
        selfCareRecommendations: [
          "Monitor your symptoms closely",
          "Stay hydrated and get adequate rest",
          "Consult with a healthcare professional for proper evaluation"
        ],
        urgencyLevel: "within_week",
        recommendedSpecialty: aiRecommendedSpecialty,
        disclaimer: "This analysis is for informational purposes only and should not replace professional medical advice. Please consult with a healthcare professional for proper diagnosis and treatment."
      };
    }

    return new Response(JSON.stringify(parsedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-symptoms function:', error);
    
    // Return a proper error response structure
    const errorResponse = {
      possibleConditions: [
        {
          condition: "Analysis Unavailable", 
          likelihood: "unknown", 
          description: "Unable to analyze symptoms at this time. Please consult with a healthcare professional."
        }
      ],
      selfCareRecommendations: [
        "Consult with a healthcare professional for proper evaluation",
        "Monitor your symptoms and seek immediate care if they worsen"
      ],
      urgencyLevel: "within_24_hours",
      recommendedSpecialty: "General Medicine",
      disclaimer: "This service is temporarily unavailable. Please consult with a healthcare professional for medical advice."
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 200, // Return 200 to avoid frontend error handling
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});