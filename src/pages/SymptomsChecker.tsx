
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import SymptomChecker from '@/components/SymptomChecker';

const SymptomsChecker = () => {
  const navigate = useNavigate();

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
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Symptoms Checker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get AI-powered insights about your symptoms and personalized health recommendations.
          </p>
        </div>

        <SymptomChecker />
      </div>
    </div>
  );
};

export default SymptomsChecker;
