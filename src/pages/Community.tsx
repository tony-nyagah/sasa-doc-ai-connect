import Navigation from '@/components/Navigation';
import CommunityGroups from '@/components/CommunityGroups';
import WeatherWidget from '@/components/WeatherWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, MessageCircle, Shield } from 'lucide-react';

const Community = () => {
  const benefits = [
    {
      icon: Heart,
      title: 'Emotional Support',
      description: 'Connect with others who understand your health journey and challenges.'
    },
    {
      icon: Users,
      title: 'Shared Experiences',
      description: 'Learn from others who have faced similar health conditions and treatments.'
    },
    {
      icon: MessageCircle,
      title: 'Safe Space',
      description: 'Share your thoughts and concerns in a judgment-free, supportive environment.'
    },
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'Your privacy is our priority. All groups maintain strict confidentiality.'
    }
  ];

  return (
    <div className="min-h-screen bg-medical-light">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Health Support Communities
              </h1>
              <p className="text-xl text-gray-600">
                Join supportive communities where you can connect with others facing similar health challenges. 
                Share experiences, find encouragement, and reduce the stigma around medical conditions.
              </p>
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {benefits.map((benefit, index) => (
                <Card key={benefit.title} className="medical-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 medical-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <CommunityGroups />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <WeatherWidget />
            
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-lg">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-medical-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Be respectful and supportive to all members</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-medical-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Share experiences, not medical advice</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-medical-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Maintain privacy and confidentiality</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-medical-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Report inappropriate content</span>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p className="mb-3">
                  If you're experiencing a medical emergency, please contact emergency services immediately.
                </p>
                <p>
                  For mental health support, consider reaching out to a crisis helpline or mental health professional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;