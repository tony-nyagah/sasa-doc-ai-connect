/*
  # Add Location Support for Doctors and Patients

  1. New Columns
    - Add location fields to doctors table (city, state, country, latitude, longitude, address)
    - Add location fields to patients table for location-based matching
    - Create distance calculation function

  2. Sample Data
    - Update existing doctors with realistic location data across major US cities
    - Add coordinates for distance calculations

  3. Indexes
    - Add indexes for location-based queries
    - Optimize for proximity searches
*/

-- Add location columns to doctors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'city'
  ) THEN
    ALTER TABLE doctors ADD COLUMN city TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'state'
  ) THEN
    ALTER TABLE doctors ADD COLUMN state TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'country'
  ) THEN
    ALTER TABLE doctors ADD COLUMN country TEXT DEFAULT 'United States';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE doctors ADD COLUMN latitude DECIMAL(10, 8);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE doctors ADD COLUMN longitude DECIMAL(11, 8);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'address'
  ) THEN
    ALTER TABLE doctors ADD COLUMN address TEXT;
  END IF;
END $$;

-- Add location columns to patients table for location-based matching
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'patients' AND column_name = 'city'
  ) THEN
    ALTER TABLE patients ADD COLUMN city TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'patients' AND column_name = 'state'
  ) THEN
    ALTER TABLE patients ADD COLUMN state TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'patients' AND column_name = 'country'
  ) THEN
    ALTER TABLE patients ADD COLUMN country TEXT DEFAULT 'United States';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'patients' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE patients ADD COLUMN latitude DECIMAL(10, 8);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'patients' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE patients ADD COLUMN longitude DECIMAL(11, 8);
  END IF;
END $$;

-- Create function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL, lon1 DECIMAL, 
  lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  R DECIMAL := 3959; -- Earth's radius in miles
  dLat DECIMAL;
  dLon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  IF lat1 IS NULL OR lon1 IS NULL OR lat2 IS NULL OR lon2 IS NULL THEN
    RETURN NULL;
  END IF;
  
  dLat := RADIANS(lat2 - lat1);
  dLon := RADIANS(lon2 - lon1);
  
  a := SIN(dLat/2) * SIN(dLat/2) + 
       COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * 
       SIN(dLon/2) * SIN(dLon/2);
  c := 2 * ATAN2(SQRT(a), SQRT(1-a));
  
  RETURN R * c;
END;
$$ LANGUAGE plpgsql;

-- Update existing doctors with sample location data across major US cities
UPDATE doctors SET 
  city = CASE (RANDOM() * 15)::INTEGER
    WHEN 0 THEN 'New York'
    WHEN 1 THEN 'Los Angeles'
    WHEN 2 THEN 'Chicago'
    WHEN 3 THEN 'Houston'
    WHEN 4 THEN 'Phoenix'
    WHEN 5 THEN 'Philadelphia'
    WHEN 6 THEN 'San Antonio'
    WHEN 7 THEN 'San Diego'
    WHEN 8 THEN 'Dallas'
    WHEN 9 THEN 'Miami'
    WHEN 10 THEN 'Atlanta'
    WHEN 11 THEN 'Boston'
    WHEN 12 THEN 'Seattle'
    WHEN 13 THEN 'Denver'
    WHEN 14 THEN 'Las Vegas'
    ELSE 'Orlando'
  END
WHERE city IS NULL;

-- Update state based on city
UPDATE doctors SET 
  state = CASE city
    WHEN 'New York' THEN 'NY'
    WHEN 'Los Angeles' THEN 'CA'
    WHEN 'Chicago' THEN 'IL'
    WHEN 'Houston' THEN 'TX'
    WHEN 'Phoenix' THEN 'AZ'
    WHEN 'Philadelphia' THEN 'PA'
    WHEN 'San Antonio' THEN 'TX'
    WHEN 'San Diego' THEN 'CA'
    WHEN 'Dallas' THEN 'TX'
    WHEN 'Miami' THEN 'FL'
    WHEN 'Atlanta' THEN 'GA'
    WHEN 'Boston' THEN 'MA'
    WHEN 'Seattle' THEN 'WA'
    WHEN 'Denver' THEN 'CO'
    WHEN 'Las Vegas' THEN 'NV'
    ELSE 'FL'
  END
WHERE state IS NULL;

-- Update coordinates based on city (with slight randomization for realistic distribution)
UPDATE doctors SET 
  latitude = CASE city
    WHEN 'New York' THEN 40.7128 + (RANDOM() - 0.5) * 0.2
    WHEN 'Los Angeles' THEN 34.0522 + (RANDOM() - 0.5) * 0.2
    WHEN 'Chicago' THEN 41.8781 + (RANDOM() - 0.5) * 0.2
    WHEN 'Houston' THEN 29.7604 + (RANDOM() - 0.5) * 0.2
    WHEN 'Phoenix' THEN 33.4484 + (RANDOM() - 0.5) * 0.2
    WHEN 'Philadelphia' THEN 39.9526 + (RANDOM() - 0.5) * 0.2
    WHEN 'San Antonio' THEN 29.4241 + (RANDOM() - 0.5) * 0.2
    WHEN 'San Diego' THEN 32.7157 + (RANDOM() - 0.5) * 0.2
    WHEN 'Dallas' THEN 32.7767 + (RANDOM() - 0.5) * 0.2
    WHEN 'Miami' THEN 25.7617 + (RANDOM() - 0.5) * 0.2
    WHEN 'Atlanta' THEN 33.7490 + (RANDOM() - 0.5) * 0.2
    WHEN 'Boston' THEN 42.3601 + (RANDOM() - 0.5) * 0.2
    WHEN 'Seattle' THEN 47.6062 + (RANDOM() - 0.5) * 0.2
    WHEN 'Denver' THEN 39.7392 + (RANDOM() - 0.5) * 0.2
    WHEN 'Las Vegas' THEN 36.1699 + (RANDOM() - 0.5) * 0.2
    ELSE 28.5383 + (RANDOM() - 0.5) * 0.2
  END,
  longitude = CASE city
    WHEN 'New York' THEN -74.0060 + (RANDOM() - 0.5) * 0.2
    WHEN 'Los Angeles' THEN -118.2437 + (RANDOM() - 0.5) * 0.2
    WHEN 'Chicago' THEN -87.6298 + (RANDOM() - 0.5) * 0.2
    WHEN 'Houston' THEN -95.3698 + (RANDOM() - 0.5) * 0.2
    WHEN 'Phoenix' THEN -112.0740 + (RANDOM() - 0.5) * 0.2
    WHEN 'Philadelphia' THEN -75.1652 + (RANDOM() - 0.5) * 0.2
    WHEN 'San Antonio' THEN -98.4936 + (RANDOM() - 0.5) * 0.2
    WHEN 'San Diego' THEN -117.1611 + (RANDOM() - 0.5) * 0.2
    WHEN 'Dallas' THEN -96.7970 + (RANDOM() - 0.5) * 0.2
    WHEN 'Miami' THEN -80.1918 + (RANDOM() - 0.5) * 0.2
    WHEN 'Atlanta' THEN -84.3880 + (RANDOM() - 0.5) * 0.2
    WHEN 'Boston' THEN -71.0589 + (RANDOM() - 0.5) * 0.2
    WHEN 'Seattle' THEN -122.3321 + (RANDOM() - 0.5) * 0.2
    WHEN 'Denver' THEN -104.9903 + (RANDOM() - 0.5) * 0.2
    WHEN 'Las Vegas' THEN -115.1398 + (RANDOM() - 0.5) * 0.2
    ELSE -81.3792 + (RANDOM() - 0.5) * 0.2
  END
WHERE latitude IS NULL;

-- Update address field
UPDATE doctors SET 
  address = city || ', ' || state || ', United States',
  country = 'United States'
WHERE address IS NULL;

-- Create indexes for location-based queries
CREATE INDEX IF NOT EXISTS idx_doctors_location ON doctors(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_doctors_city_state ON doctors(city, state);
CREATE INDEX IF NOT EXISTS idx_patients_location ON patients(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty_location ON doctors(specialty_id, latitude, longitude);