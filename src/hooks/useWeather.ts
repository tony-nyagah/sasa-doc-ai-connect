import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  city: string;
  country: string;
  icon: string;
}

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export const useWeather = (latitude: number | null, longitude: number | null) => {
  const [weather, setWeather] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchWeather = async () => {
      setWeather(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        if (!apiKey) {
          throw new Error('OpenWeather API key not configured');
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        
        setWeather({
          data: {
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            city: data.name,
            country: data.sys.country,
            icon: data.weather[0].icon,
          },
          loading: false,
          error: null,
        });
      } catch (error) {
        setWeather(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch weather data',
        }));
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return weather;
};