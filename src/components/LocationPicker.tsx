import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Loader2, Search, Navigation } from 'lucide-react';
import { useLocationService } from '@/hooks/useLocationService';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  address: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData | null;
  placeholder?: string;
  label?: string;
}

const LocationPicker = ({ 
  onLocationSelect, 
  initialLocation, 
  placeholder = "Enter city, state, or address",
  label = "Location"
}: LocationPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(initialLocation || null);
  
  const { getCurrentLocation, searchLocation, loading: geoLoading } = useLocationService();
  const { toast } = useToast();

  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
      setSearchQuery(initialLocation.address);
    }
  }, [initialLocation]);

  const handleCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setSelectedLocation(location);
      setSearchQuery(location.address);
      onLocationSelect(location);
      toast({
        title: "Location found",
        description: `Using your current location: ${location.city}, ${location.state}`,
      });
    } else {
      toast({
        title: "Location error",
        description: "Could not get your current location. Please enter manually.",
        variant: "destructive"
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchLocation(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "No results",
          description: "No locations found for your search. Try a different query.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Search error",
        description: "Failed to search locations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    setSearchQuery(location.address);
    setSearchResults([]);
    onLocationSelect(location);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location-search">{label}</Label>
        <div className="flex gap-2 mt-1">
          <div className="relative flex-1">
            <Input
              id="location-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="pr-10"
            />
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            variant="outline"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
          <Button
            type="button"
            onClick={handleCurrentLocation}
            disabled={geoLoading}
            variant="outline"
            title="Use current location"
          >
            {geoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardContent className="p-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Select a location:</p>
              {searchResults.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-medical-primary flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{location.city}</div>
                      <div className="text-xs text-gray-500">{location.address}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <Card className="bg-medical-secondary">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-medical-primary" />
              <div>
                <div className="font-medium text-sm">Selected Location</div>
                <div className="text-xs text-gray-600">{selectedLocation.address}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationPicker;