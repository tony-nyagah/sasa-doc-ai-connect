import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Database, Users, Stethoscope, MapPin } from 'lucide-react';

interface Doctor {
  id: string;
  license_number: string;
  years_of_experience: number;
  city: string;
  state: string;
  specialty: {
    name: string;
  };
  profile: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const DatabaseViewer = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalCities: 0,
    totalSpecialties: 0
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          specialty:specialties(name),
          profile:profiles(first_name, last_name, email)
        `)
        .order('city');

      if (error) throw error;

      setDoctors(data || []);
      
      // Calculate stats
      const cities = [...new Set(data?.map(d => d.city) || [])];
      const specialties = [...new Set(data?.map(d => d.specialty?.name) || [])];
      
      setStats({
        totalDoctors: data?.length || 0,
        totalCities: cities.length,
        totalSpecialties: specialties.length
      });
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupDoctorsByCity = () => {
    return doctors.reduce((acc, doctor) => {
      const city = doctor.city;
      if (!acc[city]) {
        acc[city] = [];
      }
      acc[city].push(doctor);
      return acc;
    }, {} as Record<string, Doctor[]>);
  };

  if (loading) {
    return <div className="text-center py-8">Loading database...</div>;
  }

  const doctorsByCity = groupDoctorsByCity();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="w-6 h-6 text-medical-primary" />
        <h1 className="text-2xl font-bold">Database Viewer</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDoctors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cities</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Specialties</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSpecialties}</div>
          </CardContent>
        </Card>
      </div>

      {/* Doctors by City */}
      <div className="space-y-6">
        {Object.entries(doctorsByCity).map(([city, cityDoctors]) => (
          <Card key={city}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-medical-primary" />
                {city} ({cityDoctors.length} doctors)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cityDoctors.map((doctor) => (
                  <div key={doctor.id} className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold">
                      Dr. {doctor.profile?.first_name} {doctor.profile?.last_name}
                    </h4>
                    <p className="text-sm text-medical-primary font-medium">
                      {doctor.specialty?.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {doctor.years_of_experience} years experience
                    </p>
                    <p className="text-xs text-gray-600">
                      License: {doctor.license_number}
                    </p>
                    <p className="text-xs text-gray-600">
                      {doctor.profile?.email}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={fetchDoctors} variant="outline">
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default DatabaseViewer;
