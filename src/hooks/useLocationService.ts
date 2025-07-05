import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  address: string;
}

interface LocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
}

export const useLocationService = () => {
  const [locationState, setLocationState] = useState<LocationState>({
    location: null,
    loading: false,
    error: null,
  });

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    setLocationState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Get user's coordinates
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'));
          return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;

      // Get location details using OpenWeather Geocoding API
      const apiKey = '6f0c645626dfaf0dfa4fab259ab73406';

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to get location details');
      }

      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error('No location data found');
      }

      const locationInfo = data[0];
      const locationData: LocationData = {
        latitude,
        longitude,
        city: locationInfo.name || 'Unknown',
        state: locationInfo.state || '',
        country: locationInfo.country || 'US',
        address: `${locationInfo.name || 'Unknown'}, ${locationInfo.state || ''}, ${locationInfo.country || 'US'}`,
      };

      setLocationState({
        location: locationData,
        loading: false,
        error: null,
      });

      return locationData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setLocationState({
        location: null,
        loading: false,
        error: errorMessage,
      });
      return null;
    }
  };

  const searchLocation = async (query: string): Promise<LocationData[]> => {
    try {
      const apiKey = '6f0c645626dfaf0dfa4fab259ab73406';

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to search locations');
      }

      const data = await response.json();
      
      return data.map((item: any) => ({
        latitude: item.lat,
        longitude: item.lon,
        city: item.name,
        state: item.state || '',
        country: item.country,
        address: `${item.name}, ${item.state ? item.state + ', ' : ''}${item.country}`,
      }));
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return {
    ...locationState,
    getCurrentLocation,
    searchLocation,
    calculateDistance,
  };
};