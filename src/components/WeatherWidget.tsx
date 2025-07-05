import { Cloud, Sun, CloudRain, MapPin, Thermometer, Droplets, Wind } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeather } from '@/hooks/useWeather';

const WeatherWidget = () => {
  const { latitude, longitude, error: locationError, loading: locationLoading } = useGeolocation();
  const { data: weather, loading: weatherLoading, error: weatherError } = useWeather(latitude, longitude);

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <Sun className="w-6 h-6 text-yellow-500" />;
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return <Cloud className="w-6 h-6 text-gray-500" />;
    if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11')) return <CloudRain className="w-6 h-6 text-blue-500" />;
    return <Sun className="w-6 h-6 text-yellow-500" />;
  };

  if (locationLoading || weatherLoading) {
    return (
      <Card className="medical-card">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (locationError || weatherError) {
    return (
      <Card className="medical-card">
        <CardContent className="p-4">
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">Weather unavailable</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card className="medical-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-medical-primary mr-1" />
            <span className="text-sm font-medium text-gray-700">
              {weather.city}, {weather.country}
            </span>
          </div>
          {getWeatherIcon(weather.icon)}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Thermometer className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-2xl font-bold text-gray-900">{weather.temperature}°C</span>
          </div>
          <span className="text-sm text-gray-600 capitalize">{weather.description}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
          <div className="flex items-center">
            <Droplets className="w-3 h-3 mr-1" />
            <span>Humidity: {weather.humidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="w-3 h-3 mr-1" />
            <span>Wind: {weather.windSpeed} m/s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;