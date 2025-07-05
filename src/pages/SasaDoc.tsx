
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Brain, 
  Stethoscope, 
  Heart, 
  Calendar,
  MessageSquare,
  Search,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const SasaDoc = () => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const sasadocFeatures = [
    {
      id: 'symptoms-checker',
      title: 'Smart Symptoms Checker',
      description: 'AI-powered tool that interacts with you to analyze your symptoms and provide possible causes with medical insights.',
      icon: Brain,
      color: 'bg-purple-500',
      features: [
        'Interactive symptom analysis',
        'AI-powered diagnosis assistance',
        'Severity assessment',
        'Recommended next steps'
      ]
    },
    {
      id: 'self-care',
      title: 'Self Care Guide',
      description: 'Get personalized self-care tips, dietary advice, exercises, and lifestyle recommendations based on your medical condition.',
      icon: Heart,
      color: 'bg-pink-500',
      features: [
        'Condition-specific advice',
        'Diet and nutrition plans',
        'Exercise recommendations',
        'Lifestyle modifications'
      ]
    },
    {
      id: 'appointment-booking',
      title: 'Appointment Booking',
      description: 'Book appointments with medical professionals, check availability, and engage in secure messaging.',
      icon: Calendar,
      color: 'bg-blue-500',
      features: [
        'Real-time availability',
        'Specialist matching',
        'Appointment reminders',
        'Professional profiles'
      ]
    }
  ];

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(featureId);
    // Navigate to specific feature page
    navigate(`/sasadoc/${featureId}`);
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 text-medical-primary hover:bg-medical-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 medical-gradient rounded-2xl flex items-center justify-center">
                <Brain className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              SasaDoc AI Assistant
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience AI-powered healthcare assistance with our comprehensive suite of medical tools 
              designed to support your health journey.
            </p>
          </div>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {sasadocFeatures.map((feature, index) => (
            <Card 
              key={feature.id}
              className="medical-card hover:scale-105 cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
              onClick={() => handleFeatureClick(feature.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 group-hover:text-medical-primary transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full medical-gradient text-white hover:opacity-90 group-hover:translate-y-0 transition-all">
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Capabilities Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              AI-Powered Healthcare Intelligence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our advanced AI technology provides accurate, reliable, and personalized healthcare guidance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Search, title: 'Smart Analysis', desc: 'Advanced symptom recognition' },
              { icon: Stethoscope, title: 'Medical Accuracy', desc: 'Clinically validated responses' },
              { icon: MessageSquare, title: 'Natural Interaction', desc: 'Conversational AI interface' },
              { icon: Brain, title: 'Learning System', desc: 'Continuously improving AI' }
            ].map((capability, index) => (
              <div key={capability.title} className="text-center">
                <div className="w-12 h-12 medical-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                  <capability.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {capability.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {capability.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="text-center bg-medical-secondary rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Begin your AI-powered healthcare journey today. Choose any of our features above to start receiving personalized medical assistance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="medical-gradient text-white text-lg px-8 py-3 hover:opacity-90"
              onClick={() => handleFeatureClick('symptoms-checker')}
            >
              Try Symptoms Checker
            </Button>
            <Button 
              variant="outline"
              className="text-lg px-8 py-3 border-medical-primary text-medical-primary hover:bg-medical-secondary"
              onClick={() => navigate('/profile')}
            >
              Create Profile First
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SasaDoc;
