export interface Location {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface UserLocation {
  userId: string;
  location: Location;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: Location;
  rating: number;
  availability: boolean;
  distance?: number; // calculated distance from patient
}

export interface Patient {
  id: string;
  name: string;
  location: Location;
  age: number;
  gender: string;
}

export interface LocationSearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}
