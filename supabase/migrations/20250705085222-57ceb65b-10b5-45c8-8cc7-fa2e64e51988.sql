
-- Create user profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  user_type TEXT CHECK (user_type IN ('doctor', 'patient')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create specialties lookup table
CREATE TABLE public.specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table with specialty reference
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialty_id UUID REFERENCES public.specialties(id),
  license_number TEXT,
  years_of_experience INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date_of_birth DATE,
  phone TEXT,
  emergency_contact TEXT,
  medical_history TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for specialties (public read)
CREATE POLICY "Anyone can view specialties" ON public.specialties
  FOR SELECT TO public USING (true);

-- RLS Policies for doctors
CREATE POLICY "Users can view their own doctor profile" ON public.doctors
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own doctor profile" ON public.doctors
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own doctor profile" ON public.doctors
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for patients
CREATE POLICY "Users can view their own patient profile" ON public.patients
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own patient profile" ON public.patients
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own patient profile" ON public.patients
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Insert some sample specialties
INSERT INTO public.specialties (name, description) VALUES
  ('General Medicine', 'Primary care and general health services'),
  ('Cardiology', 'Heart and cardiovascular system specialists'),
  ('Dermatology', 'Skin, hair, and nail care specialists'),
  ('Pediatrics', 'Medical care for infants, children, and adolescents'),
  ('Orthopedics', 'Musculoskeletal system specialists'),
  ('Neurology', 'Nervous system and brain specialists'),
  ('Psychiatry', 'Mental health and behavioral specialists'),
  ('Gynecology', 'Women''s reproductive health specialists');

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'user_type'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
