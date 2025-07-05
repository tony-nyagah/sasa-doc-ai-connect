/*
  # Add Location Support for Doctors

  1. New Columns
    - Add location fields to doctors table
    - Add city, state, country, latitude, longitude
    - Add address field for full address

  2. Sample Data
    - Update existing doctors with realistic location data
    - Distribute doctors across major cities

  3. Indexes
    - Add indexes for location-based queries
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

-- Update existing doctors with sample location data
UPDATE doctors SET 
  city = CASE (RANDOM() * 10)::INTEGER
    WHEN 0 THEN 'New York'
    WHEN 1 THEN 'Los Angeles'
    WHEN 2 THEN 'Chicago'
    WHEN 3 THEN 'Houston'
    WHEN 4 THEN 'Phoenix'
    WHEN 5 THEN 'Philadelphia'
    WHEN 6 THEN 'San Antonio'
    WHEN 7 THEN 'San Diego'
    WHEN 8 THEN 'Dallas'
    ELSE 'Miami'
  END,
  state = CASE 
    WHEN city = 'New York' THEN 'NY'
    WHEN city = 'Los Angeles' THEN 'CA'
    WHEN city = 'Chicago' THEN 'IL'
    WHEN city = 'Houston' THEN 'TX'
    WHEN city = 'Phoenix' THEN 'AZ'
    WHEN city = 'Philadelphia' THEN 'PA'
    WHEN city = 'San Antonio' THEN 'TX'
    WHEN city = 'San Diego' THEN 'CA'
    WHEN city = 'Dallas' THEN 'TX'
    ELSE 'FL'
  END,
  latitude = CASE 
    WHEN city = 'New York' THEN 40.7128 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Los Angeles' THEN 34.0522 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Chicago' THEN 41.8781 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Houston' THEN 29.7604 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Phoenix' THEN 33.4484 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Philadelphia' THEN 39.9526 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'San Antonio' THEN 29.4241 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'San Diego' THEN 32.7157 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Dallas' THEN 32.7767 + (RANDOM() - 0.5) * 0.1
    ELSE 25.7617 + (RANDOM() - 0.5) * 0.1
  END,
  longitude = CASE 
    WHEN city = 'New York' THEN -74.0060 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Los Angeles' THEN -118.2437 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Chicago' THEN -87.6298 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Houston' THEN -95.3698 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Phoenix' THEN -112.0740 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Philadelphia' THEN -75.1652 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'San Antonio' THEN -98.4936 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'San Diego' THEN -117.1611 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Dallas' THEN -96.7970 + (RANDOM() - 0.5) * 0.1
    ELSE -80.1918 + (RANDOM() - 0.5) * 0.1
  END,
  address = city || ', ' || state || ', United States',
  country = 'United States'
WHERE city IS NULL;

-- Create indexes for location-based queries
CREATE INDEX IF NOT EXISTS idx_doctors_location ON doctors(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_doctors_city_state ON doctors(city, state);
CREATE INDEX IF NOT EXISTS idx_patients_location ON patients(latitude, longitude);