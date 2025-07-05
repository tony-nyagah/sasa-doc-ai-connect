import { Doctor, Patient, Location } from "@/types/location";
import { LocationService } from "@/services/locationService";

export class DoctorMatcher {
  static findNearbyDoctors(
    patientLocation: Location,
    doctors: Doctor[],
    maxDistance: number = 50 // km
  ): Doctor[] {
    return doctors
      .map((doctor) => ({
        ...doctor,
        distance: LocationService.calculateDistance(
          patientLocation.lat,
          patientLocation.lon,
          doctor.location.lat,
          doctor.location.lon
        ),
      }))
      .filter((doctor) => doctor.distance! <= maxDistance)
      .sort((a, b) => a.distance! - b.distance!);
  }

  static findDoctorsBySpecialty(
    patientLocation: Location,
    doctors: Doctor[],
    specialty: string,
    maxDistance: number = 50
  ): Doctor[] {
    return this.findNearbyDoctors(patientLocation, doctors, maxDistance).filter(
      (doctor) =>
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
  }

  static getLocationSummary(location: Location): string {
    return `${location.name}, ${location.state || location.country}`;
  }

  static formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  }
}
