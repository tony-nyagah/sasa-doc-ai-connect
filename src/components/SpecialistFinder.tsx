import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Calendar, 
  MessageSquare, 
  Search,
  Filter,
  Clock,
  Award,
  Stethoscope,
  Navigation
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLocationService } from '@/hooks/useLocationService';
import LocationPicker from './LocationPicker';

interface Doctor {
  id: string;
  user_id: string;
  license_number: string;
  years_of_experience: number;
  specialty_id: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  address: string;
  specialty: {
    name: string;
    description: string;
  };
  profile: {
    first_name: string;
    last_name: string;
    email: string;
  };
  distance?: number;
}

interface Specialty {
  id: string;
  name: string;
  description: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  address: string;
}

interface SpecialistFinderProps {
  recommendedSpecialty: string;
  symptoms: string;
  analysis: any;
  onBack: () => void;
}

const SpecialistFinder = ({ recommendedSpecialty, symptoms, analysis, onBack }: SpecialistFinderProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<string>('50');
  const [sortBy, setSortBy] = useState<string>('distance');
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  
  const { toast } = useToast();
  const { calculateDistance, getCurrentLocation } = useLocationService();

  useEffect(() => {
    fetchSpecialties();
    initializeUserLocation();
  }, []);

  useEffect(() => {
    // Auto-select the recommended specialty
    if (specialties.length > 0 && recommendedSpecialty) {
      const matchingSpecialty = specialties.find(s => 
        s.name.toLowerCase().includes(recommendedSpecialty.toLowerCase()) ||
        recommendedSpecialty.toLowerCase().includes(s.name.toLowerCase())
      );
      if (matchingSpecialty) {
        setSelectedSpecialty(matchingSpecialty.id);
      }
    }
  }, [specialties, recommendedSpecialty]);

  useEffect(() => {
    if (userLocation) {
      fetchDoctors();
    }
  }, [userLocation, selectedSpecialty, maxDistance, sortBy]);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, experienceFilter]);

  const initializeUserLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setUserLocation(location);
    } else {
      // Default to New York if location access fails
      setUserLocation({
        latitude: 40.7128,
        longitude: -74.0060,
        city: 'New York',
        state: 'NY',
        country: 'US',
        address: 'New York, NY, US'
      });
    }
  };

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
    if (!userLocation) return;
    
    try {
      let query = supabase
        .from('doctors')
        .select(`
          *,
          specialty:specialties!inner(name, description),
          profile:profiles!inner(first_name, last_name, email)
        `)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (selectedSpecialty && selectedSpecialty !== 'all') {
        query = query.eq('specialty_id', selectedSpecialty);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched specialists data:', data);

      // Calculate distances and filter by max distance
      const doctorsWithDistance = (data || [])
        .map(doctor => ({
          ...doctor,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            doctor.latitude,
            doctor.longitude
          )
        }))
        .filter(doctor => doctor.distance <= parseFloat(maxDistance))
        .sort((a, b) => {
          switch (sortBy) {
            case 'distance':
              return a.distance - b.distance;
            case 'experience':
              return (b.years_of_experience || 0) - (a.years_of_experience || 0);
            case 'name':
              return `${a.profile?.first_name} ${a.profile?.last_name}`.localeCompare(
                `${b.profile?.first_name} ${b.profile?.last_name}`
              );
            default:
              return a.distance - b.distance;
          }
        });

      console.log('Processed specialists with distance:', doctorsWithDistance);
      setDoctors(doctorsWithDistance);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load specialists. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        `${doctor.profile?.first_name} ${doctor.profile?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${doctor.city}, ${doctor.state}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by experience
    if (experienceFilter !== 'all') {
      const minExperience = parseInt(experienceFilter);
      filtered = filtered.filter(doctor => (doctor.years_of_experience || 0) >= minExperience);
    }

    setFilteredDoctors(filtered);
  };

  const handleLocationChange = (location: LocationData) => {
    setUserLocation(location);
    toast({
      title: "Location updated",
      description: `Searching for specialists near ${location.city}, ${location.state}`,
    });
  };

  const handleBookAppointment = (doctor: Doctor) => {
    toast({
      title: "Appointment Request",
      description: `Booking appointment with Dr. ${doctor.profile?.first_name} ${doctor.profile?.last_name}`,
    });
  };

  const handleSendMessage = (doctor: Doctor) => {
    toast({
      title: "Message Sent",
      description: `Message sent to Dr. ${doctor.profile?.first_name} ${doctor.profile?.last_name}`,
    });
  };

  const getRecommendationReason = (doctor: Doctor) => {
    if (doctor.specialty?.name.toLowerCase().includes(recommendedSpecialty.toLowerCase()) ||
        recommendedSpecialty.toLowerCase().includes(doctor.specialty?.name.toLowerCase())) {
      return "Recommended based on your symptoms";
    }
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
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
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-medical-primary hover:bg-medical-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find Specialists</h1>
            <p className="text-gray-600">Recommended: {recommendedSpecialty}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Specialists
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Picker */}
          <LocationPicker
            onLocationSelect={handleLocationChange}
            initialLocation={userLocation}
            label="Search Location"
            placeholder="Enter city, state, or address to find nearby specialists"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, specialty, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Specialty</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All specialties" />
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

            <div>
              <label className="block text-sm font-medium mb-2">Experience</label>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Experience</SelectItem>
                  <SelectItem value="5">5+ years</SelectItem>
                  <SelectItem value="10">10+ years</SelectItem>
                  <SelectItem value="15">15+ years</SelectItem>
                  <SelectItem value="20">20+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Distance</label>
              <Select value={maxDistance} onValueChange={setMaxDistance}>
                <SelectTrigger>
                  <SelectValue placeholder="Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Within 10 miles</SelectItem>
                  <SelectItem value="25">Within 25 miles</SelectItem>
                  <SelectItem value="50">Within 50 miles</SelectItem>
                  <SelectItem value="100">Within 100 miles</SelectItem>
                  <SelectItem value="500">Any distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Found {filteredDoctors.length} specialist{filteredDoctors.length !== 1 ? 's' : ''}
          {userLocation && ` near ${userLocation.city}, ${userLocation.state}`}
          {selectedSpecialty && specialties.find(s => s.id === selectedSpecialty) && 
            ` in ${specialties.find(s => s.id === selectedSpecialty)?.name}`
          }
        </p>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No specialists found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or expanding your search distance.
            </p>
            <Button 
              onClick={() => {
                setSelectedSpecialty('all');
                setSearchTerm('');
                setExperienceFilter('all');
                setMaxDistance('100');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => {
            const recommendationReason = getRecommendationReason(doctor);
            
            return (
              <Card 
                key={doctor.id} 
                className={`medical-card hover:scale-105 transition-transform duration-200 ${
                  recommendationReason ? 'ring-2 ring-medical-primary' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        Dr. {doctor.profile?.first_name} {doctor.profile?.last_name}
                      </CardTitle>
                      <CardDescription className="text-medical-primary font-medium">
                        {doctor.specialty?.name}
                      </CardDescription>
                      {recommendationReason && (
                        <Badge className="mt-2 bg-medical-primary text-white text-xs">
                          Recommended
                        </Badge>
                      )}
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
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.city}, {doctor.state}</span>
                    </div>

                    {doctor.distance && (
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4" />
                        <span>{doctor.distance.toFixed(1)} miles away</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>4.8/5 rating (127 reviews)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Usually responds within 2 hours</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>License: {doctor.license_number}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 medical-gradient text-white"
                      onClick={() => handleBookAppointment(doctor)}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Book
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleSendMessage(doctor)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SpecialistFinder;