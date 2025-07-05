import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-medical-light to-medical-secondary py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Your Health,{' '}
              <span className="text-medical-primary">AI-Powered</span> Care
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with qualified healthcare professionals, get AI-powered medical insights, 
              and manage your health journey all in one comprehensive platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                className="medical-gradient text-white text-lg px-8 py-4 hover:opacity-90 group"
                onClick={() => navigate('/sasadoc')}
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                className="text-lg px-8 py-4 border-medical-primary text-medical-primary hover:bg-medical-secondary"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 medical-gradient rounded-lg mb-3 mx-auto">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-medical-primary">100%</div>
                <div className="text-sm text-gray-600">Secure</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 medical-gradient rounded-lg mb-3 mx-auto">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-medical-primary">24/7</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 medical-gradient rounded-lg mb-3 mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-medical-primary">1000+</div>
                <div className="text-sm text-gray-600">Doctors</div>
              </div>
            </div>
          </div>

          {/* Right Content - Medical Illustration */}
          <div className="animate-slide-in">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 medical-card">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 medical-gradient rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">AI</span>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">AI Health Assistant</div>
                      <div className="text-sm text-gray-600">Ready to help you</div>
                    </div>
                  </div>
                  
                  <div className="bg-medical-secondary rounded-lg p-4">
                    <p className="text-medical-dark font-medium">
                      "Hello! I'm here to help you with medical information and connect you with healthcare professionals."
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      className="flex-1 bg-medical-primary text-white hover:bg-medical-dark"
                      onClick={() => navigate('/sasadoc/symptoms-checker')}
                    >
                      Symptoms Checker
                    </Button>
                    <Button 
                      className="flex-1 bg-medical-accent text-white hover:opacity-90"
                      onClick={() => navigate('/sasadoc/appointment-booking')}
                    >
                      Find Doctors
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-medical-accent rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-medical-primary rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;