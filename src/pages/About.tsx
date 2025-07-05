
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Award, 
  Shield, 
  Heart, 
  Globe, 
  Stethoscope,
  Brain,
  Clock
} from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: Stethoscope, value: '1000+', label: 'Healthcare Professionals' },
    { icon: Globe, value: '50+', label: 'Countries Served' },
    { icon: Award, value: '99.9%', label: 'Uptime Reliability' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Patient-Centered Care',
      description: 'Every feature we build is designed with patient needs and outcomes at the forefront.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your health data is protected with enterprise-grade security and strict privacy compliance.'
    },
    {
      icon: Brain,
      title: 'AI Innovation',
      description: 'We leverage cutting-edge AI technology to provide accurate and personalized healthcare insights.'
    },
    {
      icon: Clock,
      title: '24/7 Accessibility',
      description: 'Healthcare guidance and professional connections available whenever you need them.'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      description: 'Leading telemedicine expert with 15+ years in digital health innovation.'
    },
    {
      name: 'Michael Chen',
      role: 'AI Technology Director',
      description: 'AI researcher specializing in healthcare applications and machine learning.'
    },
    {
      name: 'Dr. James Wilson',
      role: 'Clinical Advisory Head',
      description: 'Board-certified physician ensuring clinical accuracy and safety standards.'
    }
  ];

  return (
    <div className="min-h-screen bg-medical-light">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-medical-primary">SasaDoc</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We're revolutionizing healthcare access by combining artificial intelligence with human expertise 
            to provide comprehensive, accessible, and personalized medical care for everyone, everywhere.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To democratize healthcare access by bridging the gap between patients and medical professionals 
                through innovative AI technology, making quality healthcare guidance available to everyone, 
                regardless of location or economic status.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that everyone deserves access to reliable healthcare information and professional 
                medical guidance when they need it most.
              </p>
            </div>
            <div className="relative">
              <div className="medical-gradient rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Healthcare for All</h3>
                <p className="text-lg opacity-90">
                  Breaking down barriers to create a world where quality healthcare 
                  is accessible, affordable, and available to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="medical-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 medical-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-medical-primary mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do in our mission to transform healthcare.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={value.title} className="medical-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 medical-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-medical-secondary rounded-2xl p-8 lg:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Healthcare Technology</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform leverages state-of-the-art artificial intelligence and machine learning 
              to provide accurate, reliable, and personalized healthcare solutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Diagnostics</h3>
              <p className="text-gray-600">
                Advanced algorithms analyze symptoms and medical data to provide accurate health insights.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Communication</h3>
              <p className="text-gray-600">
                End-to-end encrypted messaging ensures your medical conversations remain private.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Matching</h3>
              <p className="text-gray-600">
                Smart algorithms connect you with the right healthcare professionals instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Healthcare professionals and technology experts working together to revolutionize medical care.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={member.name} className="medical-card animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 medical-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-medical-primary font-medium mb-3">{member.role}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join the Healthcare Revolution
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of healthcare today. Connect with our AI-powered platform and 
            get access to comprehensive medical guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="medical-gradient text-white text-lg px-8 py-3 hover:opacity-90">
              Get Started Now
            </Button>
            <Button 
              variant="outline"
              className="text-lg px-8 py-3 border-medical-primary text-medical-primary hover:bg-medical-secondary"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
