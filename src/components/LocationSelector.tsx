import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { LocationService } from '@/services/locationService';
import { Location, LocationSearchResult } from '@/types/location';

interface LocationSelectorProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation?: Location;
  placeholder?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelect,
  selectedLocation,
  placeholder = "Search for your location..."
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      const searchTimeout = setTimeout(async () => {
        setLoading(true);
        try {
          const locations = await LocationService.searchLocations(query);
          setResults(locations);
        } catch (error) {
          console.error('Location search failed:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300);

      return () => clearTimeout(searchTimeout);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleLocationSelect = (result: LocationSearchResult) => {
    const location: Location = {
      id: `${result.lat}-${result.lon}`,
      name: result.name,
      country: result.country,
      state: result.state,
      lat: result.lat,
      lon: result.lon
    };
    
    onLocationSelect(location);
    setQuery(`${result.name}, ${result.state || result.country}`);
    setResults([]);
  };

  const getCurrentLocation = async () => {
    setGettingCurrentLocation(true);
    try {
      const location = await LocationService.getCurrentLocation();
      onLocationSelect(location);
      setQuery(`${location.name}, ${location.state || location.country}`);
    } catch (error) {
      console.error('Failed to get current location:', error);
      alert('Unable to get your current location. Please search manually.');
    } finally {
      setGettingCurrentLocation(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={gettingCurrentLocation}
          className="px-3"
        >
          {gettingCurrentLocation ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              onClick={() => handleLocationSelect(result)}
            >
              <div className="font-medium">{result.name}</div>
              <div className="text-sm text-gray-600">
                {result.state ? `${result.state}, ${result.country}` : result.country}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedLocation && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center text-green-800">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {selectedLocation.name}, {selectedLocation.state || selectedLocation.country}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
