import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Heart, Calendar, Stethoscope, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import VoiceChat from './VoiceChat';
import WeatherWidget from './WeatherWidget';
import SpecialistFinder from './SpecialistFinder';

interface AnalysisResult {
  possibleConditions: Array<{
    condition: string;
    likelihood: string;
    description: string;
  }>;
  selfCareRecommendations: string[];
  urgencyLevel: 'immediate' | 'within_24_hours' | 'within_week' | 'routine';
  recommendedSpecialty: string;
  disclaimer: string;
}

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSpecialistFinder, setShowSpecialistFinder] = useState(false);
  const { user } = useAuth();

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError('Please describe your symptoms');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { data, error: functionError } = await supabase.functions.invoke('analyze-symptoms', {
        body: { symptoms, userType: 'patient' }
      });

      if (functionError) throw functionError;
      
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze symptoms');
      console.error('Symptom analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceTranscription = (transcribedText: string) => {
    setSymptoms(transcribedText);
  };

  const handleFindSpecialists = () => {
    setShowSpecialistFinder(true);
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'immediate': return 'bg-red-500';
      case 'within_24_hours': return 'bg-orange-500';
      case 'within_week': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showSpecialistFinder && analysis) {
    return (
      <SpecialistFinder 
        recommendedSpecialty={analysis.recommendedSpecialty}
        symptoms={symptoms}
        analysis={analysis}
        onBack={() => setShowSpecialistFinder(false)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-medical-primary" />
              AI Symptom Checker
            </CardTitle>
            <CardDescription>
              Describe your symptoms in detail and get AI-powered insights and recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Describe your symptoms
              </label>
              <Textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Please describe your symptoms in detail. Include when they started, severity, what makes them better or worse, and any other relevant information..."
                rows={6}
                className="resize-none"
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleAnalyze}
              disabled={loading || !symptoms.trim()}
              className="w-full medical-gradient text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing symptoms...
                </>
              ) : (
                'Analyze Symptoms'
              )}
            </Button>
          </CardContent>
        </Card>

        {analysis && (
          <div className="space-y-6">
            {/* Urgency Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Urgency Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`${getUrgencyColor(analysis.urgencyLevel)} text-white text-sm px-3 py-1`}>
                  {analysis.urgencyLevel.replace('_', ' ').toUpperCase()}
                </Badge>
              </CardContent>
            </Card>

            {/* Possible Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Possible Conditions</CardTitle>
                <CardDescription>
                  Based on your symptoms, here are potential conditions to consider:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.possibleConditions.map((condition, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{condition.condition}</h4>
                        <Badge className={getLikelihoodColor(condition.likelihood)}>
                          {condition.likelihood} likelihood
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{condition.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Self-Care Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Self-Care Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.selfCareRecommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommended Specialist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Recommended Specialist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{analysis.recommendedSpecialty}</p>
                    <p className="text-sm text-gray-600">Consider booking an appointment with this specialist</p>
                  </div>
                  <Button 
                    onClick={handleFindSpecialists}
                    className="medical-gradient text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Find Specialists
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {analysis.disclaimer}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <VoiceChat onTranscription={handleVoiceTranscription} />
        <WeatherWidget />
      </div>
    </div>
  );
};

export default SymptomChecker;