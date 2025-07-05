
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Star, Calendar, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Doctor {
  id: string;
  user_id: string;
  license_number: string;
  years_of_experience: number;
  specialty: {
    name: string;
    description: string;
  };
  profile: {
    first_name: string;
    last_name: string;
  };
}

interface Specialty {
  id: string;
  name: string;
  description: string;
}

const DoctorFinder = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecialties();
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty]);

  const fetchSpecialties = async () => {
    try {
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setSpecialties(data || []);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('doctors')
        .select(`
          *,
          specialty:specialties(name, description),
          profile:profiles(first_name, last_name)
        `);

      if (selectedSpecialty !== 'all') {
        query = query.eq('specialty_id', selectedSpecialty);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Find a Specialist</h2>
          <p className="text-gray-600">Connect with qualified healthcare professionals</p>
        </div>
        
        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Filter by specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {specialties.map((specialty) => (
              <SelectItem key={specialty.id} value={specialty.id}>
                {specialty.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No doctors found for the selected specialty.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="medical-card hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Dr. {doctor.profile?.first_name} {doctor.profile?.last_name}
                    </CardTitle>
                    <CardDescription className="text-medical-primary font-medium">
                      {doctor.specialty?.name}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {doctor.years_of_experience || 0}+ years
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  {doctor.specialty?.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>Available for consultation</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-600">4.8/5 rating</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 medical-gradient text-white">
                    <Calendar className="w-4 h-4 mr-1" />
                    Book
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorFinder;
