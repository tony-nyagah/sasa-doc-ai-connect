import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, MapPin, Thermometer, Droplets, Wind, Eye, Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/useGeolocation';

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  feelsLike: number;
  city: string;
  country: string;
  icon: string;
}

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherState>({
    data: null,
    loading: true,
    error: null,
  });

  const { latitude, longitude, error: locationError, loading: locationLoading } = useGeolocation();

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather(latitude, longitude);
    } else if (locationError) {
      // Fallback to a default location (New York) if geolocation fails
      fetchWeather(40.7128, -74.0060);
    }
  }, [latitude, longitude, locationError]);

  const fetchWeather = async (lat: number, lon: number) => {
    setWeather(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const apiKey = '6cf29364dfc5b956ba6bea628a659610';
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
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
          windSpeed: Math.round(data.wind.speed * 2.237), // Convert m/s to mph
          pressure: data.main.pressure,
          visibility: Math.round(data.visibility / 1000), // Convert to km
          feelsLike: Math.round(data.main.feels_like),
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

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return <Cloud className="w-8 h-8 text-gray-500" />;
    if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11')) return <CloudRain className="w-8 h-8 text-blue-500" />;
    return <Sun className="w-8 h-8 text-yellow-500" />;
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (locationLoading || weather.loading) {
    return (
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Cloud className="w-5 h-5 mr-2 text-medical-primary" />
            Current Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (weather.error) {
    return (
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Cloud className="w-5 h-5 mr-2 text-medical-primary" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">Weather unavailable</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather.data) return null;

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Cloud className="w-5 h-5 mr-2 text-medical-primary" />
          Current Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Location and Time */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <MapPin className="w-4 h-4 text-medical-primary mr-1" />
            <span className="text-sm font-medium text-gray-700">
              {weather.data.city}, {weather.data.country}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {getCurrentDate()}
          </div>
          <div className="text-xs text-gray-500">
            {getCurrentTime()}
          </div>
        </div>
        
        {/* Main Weather Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getWeatherIcon(weather.data.icon)}
            <div className="ml-3">
              <div className="text-3xl font-bold text-gray-900">
                {weather.data.temperature}°C
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {weather.data.description}
              </div>
            </div>
          </div>
        </div>

        {/* Feels Like */}
        <div className="flex items-center justify-center text-sm text-gray-600">
          <Thermometer className="w-4 h-4 mr-1" />
          <span>Feels like {weather.data.feelsLike}°C</span>
        </div>
        
        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
          <div className="flex items-center">
            <Droplets className="w-3 h-3 mr-1 text-blue-500" />
            <span>Humidity: {weather.data.humidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="w-3 h-3 mr-1 text-gray-500" />
            <span>Wind: {weather.data.windSpeed} mph</span>
          </div>
          <div className="flex items-center">
            <Gauge className="w-3 h-3 mr-1 text-purple-500" />
            <span>Pressure: {weather.data.pressure} hPa</span>
          </div>
          <div className="flex items-center">
            <Eye className="w-3 h-3 mr-1 text-green-500" />
            <span>Visibility: {weather.data.visibility} km</span>
          </div>
        </div>

        {/* Health Advisory */}
        <div className="mt-4 p-3 bg-medical-secondary rounded-lg">
          <div className="text-xs text-medical-dark">
            <strong>Health Tip:</strong> {getHealthTip(weather.data)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const getHealthTip = (weather: WeatherData): string => {
  if (weather.temperature < 5) {
    return "Cold weather - dress warmly and protect exposed skin to prevent frostbite.";
  } else if (weather.temperature > 30) {
    return "Hot weather - stay hydrated and avoid prolonged sun exposure.";
  } else if (weather.humidity > 80) {
    return "High humidity - take breaks in air conditioning if you have respiratory conditions.";
  } else if (weather.windSpeed > 25) {
    return "Windy conditions - secure loose items and be cautious if you have allergies.";
  } else {
    return "Pleasant weather conditions - great time for outdoor activities!";
  }
};

export default WeatherWidget;