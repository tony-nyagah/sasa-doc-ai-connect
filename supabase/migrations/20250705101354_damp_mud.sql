/*
  # Generate Sample Data for SasaDoc Platform

  1. Sample Data Creation
    - Create sample profiles for doctors and patients
    - Create doctor profiles with specialties
    - Create patient profiles with medical information
    - Create additional community groups
    - Add sample group memberships

  2. Data Structure
    - 20 sample doctors across different specialties
    - 50 sample patients with various conditions
    - Enhanced community groups with realistic member counts
    - Sample group memberships for realistic community engagement
*/

-- Insert sample doctor profiles
INSERT INTO profiles (id, first_name, last_name, email, user_type) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Sarah', 'Johnson', 'dr.sarah.johnson@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111112', 'Michael', 'Chen', 'dr.michael.chen@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111113', 'Emily', 'Rodriguez', 'dr.emily.rodriguez@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111114', 'David', 'Thompson', 'dr.david.thompson@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111115', 'Lisa', 'Anderson', 'dr.lisa.anderson@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111116', 'James', 'Wilson', 'dr.james.wilson@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111117', 'Maria', 'Garcia', 'dr.maria.garcia@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111118', 'Robert', 'Brown', 'dr.robert.brown@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111119', 'Jennifer', 'Davis', 'dr.jennifer.davis@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111120', 'Christopher', 'Miller', 'dr.christopher.miller@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111121', 'Amanda', 'Taylor', 'dr.amanda.taylor@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111122', 'Kevin', 'Moore', 'dr.kevin.moore@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111123', 'Rachel', 'Jackson', 'dr.rachel.jackson@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111124', 'Daniel', 'White', 'dr.daniel.white@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111125', 'Nicole', 'Harris', 'dr.nicole.harris@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111126', 'Matthew', 'Martin', 'dr.matthew.martin@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111127', 'Jessica', 'Thompson', 'dr.jessica.thompson@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111128', 'Andrew', 'Garcia', 'dr.andrew.garcia@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111129', 'Stephanie', 'Martinez', 'dr.stephanie.martinez@sasadoc.com', 'doctor'),
  ('11111111-1111-1111-1111-111111111130', 'Brian', 'Robinson', 'dr.brian.robinson@sasadoc.com', 'doctor');

-- Insert sample patient profiles
INSERT INTO profiles (id, first_name, last_name, email, user_type) VALUES
  ('22222222-2222-2222-2222-222222222221', 'John', 'Smith', 'john.smith@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222222', 'Mary', 'Johnson', 'mary.johnson@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222223', 'William', 'Brown', 'william.brown@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222224', 'Patricia', 'Davis', 'patricia.davis@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222225', 'Robert', 'Miller', 'robert.miller@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222226', 'Jennifer', 'Wilson', 'jennifer.wilson@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222227', 'Michael', 'Moore', 'michael.moore@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222228', 'Linda', 'Taylor', 'linda.taylor@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222229', 'Elizabeth', 'Anderson', 'elizabeth.anderson@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222230', 'David', 'Thomas', 'david.thomas@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222231', 'Barbara', 'Jackson', 'barbara.jackson@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222232', 'Richard', 'White', 'richard.white@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222233', 'Susan', 'Harris', 'susan.harris@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222234', 'Joseph', 'Martin', 'joseph.martin@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222235', 'Jessica', 'Garcia', 'jessica.garcia@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222236', 'Thomas', 'Martinez', 'thomas.martinez@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222237', 'Sarah', 'Robinson', 'sarah.robinson@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222238', 'Charles', 'Clark', 'charles.clark@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222239', 'Karen', 'Rodriguez', 'karen.rodriguez@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222240', 'Christopher', 'Lewis', 'christopher.lewis@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222241', 'Nancy', 'Lee', 'nancy.lee@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222242', 'Daniel', 'Walker', 'daniel.walker@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222243', 'Lisa', 'Hall', 'lisa.hall@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222244', 'Mark', 'Allen', 'mark.allen@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222245', 'Betty', 'Young', 'betty.young@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222246', 'Donald', 'Hernandez', 'donald.hernandez@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222247', 'Helen', 'King', 'helen.king@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222248', 'Paul', 'Wright', 'paul.wright@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222249', 'Dorothy', 'Lopez', 'dorothy.lopez@email.com', 'patient'),
  ('22222222-2222-2222-2222-222222222250', 'Kenneth', 'Hill', 'kenneth.hill@email.com', 'patient');

-- Insert doctor profiles with specialties
INSERT INTO doctors (user_id, specialty_id, license_number, years_of_experience) 
SELECT 
  p.id,
  s.id,
  'MD' || LPAD((ROW_NUMBER() OVER())::text, 6, '0'),
  (RANDOM() * 20 + 5)::integer
FROM profiles p
CROSS JOIN LATERAL (
  SELECT id FROM specialties ORDER BY RANDOM() LIMIT 1
) s
WHERE p.user_type = 'doctor';

-- Insert patient profiles with medical information
INSERT INTO patients (user_id, date_of_birth, phone, emergency_contact, medical_history)
SELECT 
  id,
  (CURRENT_DATE - INTERVAL '20 years' - (RANDOM() * INTERVAL '50 years'))::date,
  '+1 (555) ' || LPAD((RANDOM() * 9999999)::text, 7, '0'),
  'Emergency Contact - +1 (555) ' || LPAD((RANDOM() * 9999999)::text, 7, '0'),
  CASE (RANDOM() * 5)::integer
    WHEN 0 THEN 'Hypertension, managed with medication'
    WHEN 1 THEN 'Type 2 Diabetes, diet controlled'
    WHEN 2 THEN 'Asthma, uses inhaler as needed'
    WHEN 3 THEN 'Arthritis, physical therapy ongoing'
    WHEN 4 THEN 'Anxiety, counseling and medication'
    ELSE 'No significant medical history'
  END
FROM profiles
WHERE user_type = 'patient';

-- Update community groups with more realistic data and add new ones
UPDATE community_groups SET 
  member_count = (RANDOM() * 200 + 50)::integer,
  description = CASE name
    WHEN 'Diabetes Support Circle' THEN 'A supportive community for people managing diabetes and their families. Share experiences, tips, and encouragement on your diabetes journey.'
    WHEN 'Heart Health Warriors' THEN 'Connect with others on their cardiovascular health journey. Discuss treatments, lifestyle changes, and recovery experiences.'
    WHEN 'Mental Wellness Hub' THEN 'Safe space for mental health discussions and support. Share coping strategies and find understanding in a judgment-free environment.'
    WHEN 'Cancer Survivors Network' THEN 'Strength through shared experiences and hope. Connect with cancer survivors and those currently fighting the battle.'
    WHEN 'Chronic Pain Support' THEN 'Understanding and managing chronic pain together. Share pain management techniques and emotional support.'
    WHEN 'Anxiety & Depression Circle' THEN 'Private group for anxiety and depression support. Share experiences and coping strategies in a safe environment.'
    WHEN 'Autoimmune Warriors' THEN 'Living well with autoimmune conditions. Connect with others managing lupus, rheumatoid arthritis, and other autoimmune disorders.'
    WHEN 'Pregnancy & Motherhood' THEN 'Support for expecting and new mothers. Share pregnancy experiences, parenting tips, and postpartum support.'
    ELSE description
  END;

-- Insert additional community groups
INSERT INTO community_groups (name, description, condition, is_private, member_count, created_by) VALUES
  ('ADHD Support Network', 'Community for adults and parents of children with ADHD. Share strategies for managing symptoms and daily life.', 'ADHD', false, 89),
  ('Migraine Relief Circle', 'Support group for those suffering from chronic migraines and headaches. Share triggers, treatments, and coping methods.', 'Migraines', false, 156),
  ('Fibromyalgia Friends', 'Understanding fibromyalgia together. Connect with others who understand the daily challenges of this condition.', 'Fibromyalgia', false, 67),
  ('IBS & Digestive Health', 'Support for those managing IBS and other digestive disorders. Share dietary tips and treatment experiences.', 'Digestive Disorders', false, 134),
  ('Sleep Disorders Support', 'Community for those with sleep apnea, insomnia, and other sleep disorders. Share solutions and support.', 'Sleep Disorders', false, 78),
  ('Thyroid Health Circle', 'Support for those with hypothyroidism, hyperthyroidism, and other thyroid conditions.', 'Thyroid Disorders', false, 112),
  ('Addiction Recovery Support', 'Private support group for those in recovery from addiction. Share experiences and maintain accountability.', 'Addiction Recovery', true, 45),
  ('Eating Disorder Recovery', 'Safe space for those recovering from eating disorders. Share recovery journeys and support each other.', 'Eating Disorders', true, 34),
  ('Chronic Fatigue Syndrome', 'Support for those living with CFS/ME. Share energy management tips and understanding.', 'Chronic Fatigue', false, 89),
  ('Skin Conditions Support', 'Community for those with eczema, psoriasis, and other skin conditions. Share treatment experiences.', 'Dermatological Conditions', false, 123),
  ('Vision & Hearing Support', 'Support for those with vision or hearing impairments. Share adaptive strategies and resources.', 'Sensory Impairments', false, 67),
  ('Rare Disease Warriors', 'Community for those with rare diseases and their families. Find others with similar conditions and share resources.', 'Rare Diseases', false, 45);

-- Create sample group memberships for realistic community engagement
INSERT INTO group_members (group_id, user_id, role)
SELECT 
  cg.id,
  p.id,
  CASE 
    WHEN RANDOM() < 0.05 THEN 'admin'
    WHEN RANDOM() < 0.15 THEN 'moderator'
    ELSE 'member'
  END
FROM community_groups cg
CROSS JOIN profiles p
WHERE p.user_type = 'patient'
  AND RANDOM() < 0.3  -- 30% chance each patient joins each group
LIMIT 1000;  -- Limit to prevent too many memberships

-- Update member counts based on actual memberships
UPDATE community_groups 
SET member_count = (
  SELECT COUNT(*) 
  FROM group_members 
  WHERE group_id = community_groups.id
)
WHERE EXISTS (
  SELECT 1 FROM group_members WHERE group_id = community_groups.id
);