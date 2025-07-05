import { Location, LocationSearchResult } from "@/types/location";

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/geo/1.0";

export class LocationService {
  static async searchLocations(query: string): Promise<LocationSearchResult[]> {
    if (!API_KEY) {
      throw new Error("OpenWeatherMap API key not configured");
    }

    try {
      const response = await fetch(
        `${BASE_URL}/direct?q=${encodeURIComponent(
          query
        )}&limit=5&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }

      const data = await response.json();
      return data.map((item: any) => ({
        name: item.name,
        country: item.country,
        state: item.state,
        lat: item.lat,
        lon: item.lon,
      }));
    } catch (error) {
      console.error("Location search error:", error);
      throw new Error("Failed to search locations");
    }
  }

  static async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const location = await this.reverseGeocode(latitude, longitude);
            resolve(location);
          } catch (error) {
            reject(error);
          }
        },
        (error) => reject(new Error("Failed to get current location"))
      );
    });
  }

  static async reverseGeocode(lat: number, lon: number): Promise<Location> {
    if (!API_KEY) {
      throw new Error("OpenWeatherMap API key not configured");
    }

    try {
      const response = await fetch(
        `${BASE_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to reverse geocode");
      }

      const data = await response.json();
      const item = data[0];

      return {
        id: `${item.lat}-${item.lon}`,
        name: item.name,
        country: item.country,
        state: item.state,
        lat: item.lat,
        lon: item.lon,
      };
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      throw new Error("Failed to get location details");
    }
  }

  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
