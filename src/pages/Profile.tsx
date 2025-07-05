
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  Edit,
  Save,
  Camera,
  Activity,
  Clock,
  FileText
} from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    location: 'New York, NY',
    emergencyContact: 'Jane Doe - +1 (555) 987-6543',
    medicalConditions: 'Hypertension, Diabetes Type 2',
    allergies: 'Penicillin, Shellfish',
    currentMedications: 'Metformin 500mg, Lisinopril 10mg'
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Saving profile data:', profileData);
  };

  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80 mmHg', status: 'normal', icon: Heart },
    { label: 'Heart Rate', value: '72 BPM', status: 'normal', icon: Activity },
    { label: 'Weight', value: '165 lbs', status: 'normal', icon: User },
    { label: 'Last Checkup', value: '2 months ago', status: 'due', icon: Calendar }
  ];

  const recentActivity = [
    { action: 'Completed symptoms assessment', date: '2 days ago', icon: FileText },
    { action: 'Scheduled appointment with Dr. Smith', date: '1 week ago', icon: Calendar },
    { action: 'Updated medical history', date: '2 weeks ago', icon: Edit },
    { action: 'Received self-care recommendations', date: '3 weeks ago', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-medical-light">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-6 sm:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-lg text-gray-600">Manage your health information and preferences</p>
            </div>
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={isEditing ? "bg-green-500 hover:bg-green-600" : "medical-gradient hover:opacity-90"}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-gray-900">
                  <User className="w-6 h-6 mr-3 text-medical-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 medical-gradient rounded-full flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">
                        {profileData.firstName[0]}{profileData.lastName[0]}
                      </span>
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-medical-primary rounded-full flex items-center justify-center text-white hover:bg-medical-dark">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={profileData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-gray-900">
                  <Heart className="w-6 h-6 mr-3 text-medical-primary" />
                  Medical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="medicalConditions">Medical Conditions</Label>
                  <Textarea
                    id="medicalConditions"
                    value={profileData.medicalConditions}
                    onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={profileData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    value={profileData.currentMedications}
                    onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Health Metrics & Activity */}
          <div className="space-y-8">
            {/* Health Metrics */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-900">
                  <Activity className="w-5 h-5 mr-2 text-medical-primary" />
                  Health Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthMetrics.map((metric, index) => (
                  <div key={metric.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <metric.icon className="w-5 h-5 text-medical-primary mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{metric.label}</div>
                        <div className="text-sm text-gray-600">{metric.value}</div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      metric.status === 'normal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {metric.status}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-900">
                  <Clock className="w-5 h-5 mr-2 text-medical-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-8 h-8 medical-gradient rounded-full flex items-center justify-center flex-shrink-0">
                      <activity.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                      <div className="text-xs text-gray-500">{activity.date}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-medical-primary hover:bg-medical-dark text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full justify-start border-medical-primary text-medical-primary hover:bg-medical-secondary">
                  <FileText className="w-4 h-4 mr-2" />
                  View Medical Records
                </Button>
                <Button variant="outline" className="w-full justify-start border-medical-primary text-medical-primary hover:bg-medical-secondary">
                  <Heart className="w-4 h-4 mr-2" />
                  Get Self-Care Tips
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
