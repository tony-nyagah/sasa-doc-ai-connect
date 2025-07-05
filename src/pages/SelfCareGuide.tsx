
import { ArrowLeft, Heart, Activity, Utensils, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const SelfCareGuide = () => {
  const navigate = useNavigate();

  const selfCareCategories = [
    {
      icon: Heart,
      title: 'Mental Wellness',
      description: 'Stress management and emotional health',
      tips: [
        'Practice deep breathing exercises for 5-10 minutes daily',
        'Maintain a gratitude journal',
        'Limit screen time before bedtime',
        'Connect with friends and family regularly'
      ],
      color: 'bg-pink-500'
    },
    {
      icon: Activity,
      title: 'Physical Activity',
      description: 'Exercise and movement recommendations',
      tips: [
        'Aim for 30 minutes of moderate exercise daily',
        'Take regular breaks from sitting',
        'Try low-impact activities like walking or swimming',
        'Include strength training 2-3 times per week'
      ],
      color: 'bg-blue-500'
    },
    {
      icon: Utensils,
      title: 'Nutrition',
      description: 'Healthy eating habits and dietary advice',
      tips: [
        'Eat a variety of colorful fruits and vegetables',
        'Stay hydrated with 8-10 glasses of water daily',
        'Limit processed foods and added sugars',
        'Practice mindful eating and portion control'
      ],
      color: 'bg-green-500'
    },
    {
      icon: Moon,
      title: 'Sleep Hygiene',
      description: 'Better sleep for better health',
      tips: [
        'Maintain a consistent sleep schedule',
        'Create a relaxing bedtime routine',
        'Keep your bedroom cool and dark',
        'Avoid caffeine and large meals before bedtime'
      ],
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-medical-light">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/sasadoc')}
          className="mb-6 text-medical-primary hover:bg-medical-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to SasaDoc
        </Button>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Self Care Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Personalized wellness tips and healthy lifestyle recommendations to support your overall well-being.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {selfCareCategories.map((category, index) => (
            <Card key={category.title} className="medical-card hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-medical-secondary">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Personalized Recommendations</CardTitle>
            <CardDescription className="text-center">
              Get AI-powered self-care advice tailored to your specific needs and health goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="medical-gradient text-white text-lg px-8 py-3">
              Get Personalized Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelfCareGuide;
