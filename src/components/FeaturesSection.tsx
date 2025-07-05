
import { Button } from '@/components/ui/button';
import { 
  Stethoscope, 
  Brain, 
  MapPin, 
  MessageSquare, 
  Calendar, 
  Activity,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturesSection = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      id: 'doctors-hub',
      title: 'Doctors Hub',
      description: 'Find qualified healthcare professionals based on specialty, location, and availability.',
      icon: Stethoscope,
      color: 'bg-blue-500',
      path: '/doctors-hub'
    },
    {
      id: 'sasadoc-ai',
      title: 'SasaDoc AI',
      description: 'AI-powered medical assistance with symptoms checker, self-care tips, and appointment booking.',
      icon: Brain,
      color: 'bg-purple-500',
      path: '/sasadoc'
    },
    {
      id: 'hospitals-nearby',
      title: 'Hospitals Near Me',
      description: 'Discover medical facilities around you with integrated maps and specialized services.',
      icon: MapPin,
      color: 'bg-green-500',
      path: '/hospitals'
    }
  ];

  const additionalFeatures = [
    {
      title: 'Secure Messaging',
      description: 'Direct communication with healthcare providers',
      icon: MessageSquare
    },
    {
      title: 'Appointment Management',
      description: 'Schedule and manage your medical appointments',
      icon: Calendar
    },
    {
      title: 'Health Tracking',
      description: 'Monitor your health metrics and progress',
      icon: Activity
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of healthcare with our integrated platform that combines 
            AI technology with professional medical expertise.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <div
              key={feature.id}
              className="feature-card group animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
              onClick={() => navigate(feature.path)}
            >
              <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-medical-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="flex items-center text-medical-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Explore Now
                <ChevronRight className="w-5 h-5 ml-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-medical-light rounded-2xl p-8 lg:p-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Additional Features
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 medical-gradient rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Button 
            className="medical-gradient text-white text-lg px-12 py-4 hover:opacity-90"
            onClick={() => navigate('/profile')}
          >
            Create Your Profile
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
