/*
  # Add More Doctors for Testing

  1. New Sample Data
    - Add 50+ additional doctor profiles across all specialties
    - Ensure good distribution across specialties
    - Add realistic experience levels and license numbers
    - Create comprehensive test data for specialist finder

  2. Data Distribution
    - General Medicine: 15 doctors
    - Cardiology: 8 doctors  
    - Dermatology: 6 doctors
    - Pediatrics: 8 doctors
    - Orthopedics: 6 doctors
    - Neurology: 5 doctors
    - Psychiatry: 5 doctors
    - Gynecology: 5 doctors
*/

-- Insert additional doctor profiles
INSERT INTO profiles (id, first_name, last_name, email, user_type) VALUES
  -- General Medicine Doctors
  ('33333333-3333-3333-3333-333333333301', 'Alexander', 'Mitchell', 'dr.alexander.mitchell@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333302', 'Sophia', 'Bennett', 'dr.sophia.bennett@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333303', 'William', 'Foster', 'dr.william.foster@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333304', 'Isabella', 'Cooper', 'dr.isabella.cooper@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333305', 'Benjamin', 'Reed', 'dr.benjamin.reed@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333306', 'Charlotte', 'Bailey', 'dr.charlotte.bailey@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333307', 'Lucas', 'Rivera', 'dr.lucas.rivera@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333308', 'Amelia', 'Cook', 'dr.amelia.cook@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333309', 'Henry', 'Morgan', 'dr.henry.morgan@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333310', 'Mia', 'Bell', 'dr.mia.bell@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333311', 'Oliver', 'Murphy', 'dr.oliver.murphy@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333312', 'Emma', 'Ward', 'dr.emma.ward@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333313', 'Ethan', 'Torres', 'dr.ethan.torres@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333314', 'Ava', 'Peterson', 'dr.ava.peterson@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333315', 'Mason', 'Gray', 'dr.mason.gray@sasadoc.com', 'doctor'),

  -- Cardiology Doctors
  ('33333333-3333-3333-3333-333333333316', 'Victoria', 'Hughes', 'dr.victoria.hughes@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333317', 'Nathan', 'Price', 'dr.nathan.price@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333318', 'Grace', 'Watson', 'dr.grace.watson@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333319', 'Samuel', 'Brooks', 'dr.samuel.brooks@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333320', 'Lily', 'Kelly', 'dr.lily.kelly@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333321', 'Jacob', 'Sanders', 'dr.jacob.sanders@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333322', 'Zoe', 'Price', 'dr.zoe.price@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333323', 'Caleb', 'Bennett', 'dr.caleb.bennett@sasadoc.com', 'doctor'),

  -- Dermatology Doctors
  ('33333333-3333-3333-3333-333333333324', 'Hannah', 'Wood', 'dr.hannah.wood@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333325', 'Ryan', 'Barnes', 'dr.ryan.barnes@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333326', 'Chloe', 'Ross', 'dr.chloe.ross@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333327', 'Ian', 'Henderson', 'dr.ian.henderson@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333328', 'Natalie', 'Coleman', 'dr.natalie.coleman@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333329', 'Aaron', 'Jenkins', 'dr.aaron.jenkins@sasadoc.com', 'doctor'),

  -- Pediatrics Doctors
  ('33333333-3333-3333-3333-333333333330', 'Madison', 'Perry', 'dr.madison.perry@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333331', 'Connor', 'Powell', 'dr.connor.powell@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333332', 'Addison', 'Long', 'dr.addison.long@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333333', 'Hunter', 'Patterson', 'dr.hunter.patterson@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333334', 'Layla', 'Hughes', 'dr.layla.hughes@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333335', 'Jordan', 'Flores', 'dr.jordan.flores@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333336', 'Aubrey', 'Washington', 'dr.aubrey.washington@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333337', 'Blake', 'Butler', 'dr.blake.butler@sasadoc.com', 'doctor'),

  -- Orthopedics Doctors
  ('33333333-3333-3333-3333-333333333338', 'Savannah', 'Simmons', 'dr.savannah.simmons@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333339', 'Wyatt', 'Foster', 'dr.wyatt.foster@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333340', 'Brooklyn', 'Gonzales', 'dr.brooklyn.gonzales@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333341', 'Cole', 'Bryant', 'dr.cole.bryant@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333342', 'Peyton', 'Alexander', 'dr.peyton.alexander@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333343', 'Grayson', 'Russell', 'dr.grayson.russell@sasadoc.com', 'doctor'),

  -- Neurology Doctors
  ('33333333-3333-3333-3333-333333333344', 'Ruby', 'Griffin', 'dr.ruby.griffin@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333345', 'Carson', 'Diaz', 'dr.carson.diaz@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333346', 'Mackenzie', 'Hayes', 'dr.mackenzie.hayes@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333347', 'Jaxon', 'Myers', 'dr.jaxon.myers@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333348', 'Skylar', 'Ford', 'dr.skylar.ford@sasadoc.com', 'doctor'),

  -- Psychiatry Doctors
  ('33333333-3333-3333-3333-333333333349', 'Paisley', 'Hamilton', 'dr.paisley.hamilton@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333350', 'Brayden', 'Graham', 'dr.brayden.graham@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333351', 'Kennedy', 'Sullivan', 'dr.kennedy.sullivan@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333352', 'Easton', 'Wallace', 'dr.easton.wallace@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333353', 'Autumn', 'Woods', 'dr.autumn.woods@sasadoc.com', 'doctor'),

  -- Gynecology Doctors
  ('33333333-3333-3333-3333-333333333354', 'Kinsley', 'Cole', 'dr.kinsley.cole@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333355', 'Nolan', 'Stone', 'dr.nolan.stone@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333356', 'Piper', 'Hawkins', 'dr.piper.hawkins@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333357', 'Levi', 'Duncan', 'dr.levi.duncan@sasadoc.com', 'doctor'),
  ('33333333-3333-3333-3333-333333333358', 'Genesis', 'Lawrence', 'dr.genesis.lawrence@sasadoc.com', 'doctor');

-- Insert doctor profiles with specific specialties and realistic experience
INSERT INTO doctors (user_id, specialty_id, license_number, years_of_experience) VALUES
  -- General Medicine (15 doctors)
  ('33333333-3333-3333-3333-333333333301', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100301', 12),
  ('33333333-3333-3333-3333-333333333302', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100302', 8),
  ('33333333-3333-3333-3333-333333333303', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100303', 15),
  ('33333333-3333-3333-3333-333333333304', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100304', 6),
  ('33333333-3333-3333-3333-333333333305', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100305', 20),
  ('33333333-3333-3333-3333-333333333306', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100306', 11),
  ('33333333-3333-3333-3333-333333333307', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100307', 9),
  ('33333333-3333-3333-3333-333333333308', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100308', 14),
  ('33333333-3333-3333-3333-333333333309', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100309', 18),
  ('33333333-3333-3333-3333-333333333310', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100310', 7),
  ('33333333-3333-3333-3333-333333333311', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100311', 13),
  ('33333333-3333-3333-3333-333333333312', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100312', 10),
  ('33333333-3333-3333-3333-333333333313', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100313', 16),
  ('33333333-3333-3333-3333-333333333314', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100314', 5),
  ('33333333-3333-3333-3333-333333333315', (SELECT id FROM specialties WHERE name = 'General Medicine'), 'MD100315', 22),

  -- Cardiology (8 doctors)
  ('33333333-3333-3333-3333-333333333316', (SELECT id FROM specialties WHERE name = 'Cardiology'), 'MD200316', 17),
  ('33333333-3333-3333-3333-333333333317', (SELECT id FROM specialties WHERE name = 'Cardiology'), 'MD200317', 12),
  ('33333333-3333-3333-3333-333333333318', (SELECT id FROM specialties WHERE name = 'Cardiology'), 'MD200318', 19),
  ('33333333-3333-3333-3333-333333333319', (SELECT id FROM specialties WHERE name = 'Cardiology'), 'MD200319', 14),
  ('33333333-3333-3333-3333-333333333320', (SELECT id FROM specialties WHERE name = 'Cardiology'), 'MD200320', 8),
  ('33333333-3333-3333-3333-333333333321', (SELECT id FROM specialties WHERE name = 'Cardiology'), 'MD200321', 25),
  ('33333333-3333-3333-3333-333333333322', (SELECT id FROM specialties WHERE name = 'Cardiology'), 'MD200322', 11),
  ('33333333-3333-3333-3333-333333333323', (SELECT id FROM specialties WHERE name = 'Cardiology'), 'MD200323', 16),

  -- Dermatology (6 doctors)
  ('33333333-3333-3333-3333-333333333324', (SELECT id FROM specialties WHERE name = 'Dermatology'), 'MD300324', 13),
  ('33333333-3333-3333-3333-333333333325', (SELECT id FROM specialties WHERE name = 'Dermatology'), 'MD300325', 9),
  ('33333333-3333-3333-3333-333333333326', (SELECT id FROM specialties WHERE name = 'Dermatology'), 'MD300326', 15),
  ('33333333-3333-3333-3333-333333333327', (SELECT id FROM specialties WHERE name = 'Dermatology'), 'MD300327', 7),
  ('33333333-3333-3333-3333-333333333328', (SELECT id FROM specialties WHERE name = 'Dermatology'), 'MD300328', 18),
  ('33333333-3333-3333-3333-333333333329', (SELECT id FROM specialties WHERE name = 'Dermatology'), 'MD300329', 12),

  -- Pediatrics (8 doctors)
  ('33333333-3333-3333-3333-333333333330', (SELECT id FROM specialties WHERE name = 'Pediatrics'), 'MD400330', 10),
  ('33333333-3333-3333-3333-333333333331', (SELECT id FROM specialties WHERE name = 'Pediatrics'), 'MD400331', 14),
  ('33333333-3333-3333-3333-333333333332', (SELECT id FROM specialties WHERE name = 'Pediatrics'), 'MD400332', 8),
  ('33333333-3333-3333-3333-333333333333', (SELECT id FROM specialties WHERE name = 'Pediatrics'), 'MD400333', 16),
  ('33333333-3333-3333-3333-333333333334', (SELECT id FROM specialties WHERE name = 'Pediatrics'), 'MD400334', 6),
  ('33333333-3333-3333-3333-333333333335', (SELECT id FROM specialties WHERE name = 'Pediatrics'), 'MD400335', 20),
  ('33333333-3333-3333-3333-333333333336', (SELECT id FROM specialties WHERE name = 'Pediatrics'), 'MD400336', 11),
  ('33333333-3333-3333-3333-333333333337', (SELECT id FROM specialties WHERE name = 'Pediatrics'), 'MD400337', 13),

  -- Orthopedics (6 doctors)
  ('33333333-3333-3333-3333-333333333338', (SELECT id FROM specialties WHERE name = 'Orthopedics'), 'MD500338', 15),
  ('33333333-3333-3333-3333-333333333339', (SELECT id FROM specialties WHERE name = 'Orthopedics'), 'MD500339', 9),
  ('33333333-3333-3333-3333-333333333340', (SELECT id FROM specialties WHERE name = 'Orthopedics'), 'MD500340', 17),
  ('33333333-3333-3333-3333-333333333341', (SELECT id FROM specialties WHERE name = 'Orthopedics'), 'MD500341', 12),
  ('33333333-3333-3333-3333-333333333342', (SELECT id FROM specialties WHERE name = 'Orthopedics'), 'MD500342', 21),
  ('33333333-3333-3333-3333-333333333343', (SELECT id FROM specialties WHERE name = 'Orthopedics'), 'MD500343', 8),

  -- Neurology (5 doctors)
  ('33333333-3333-3333-3333-333333333344', (SELECT id FROM specialties WHERE name = 'Neurology'), 'MD600344', 14),
  ('33333333-3333-3333-3333-333333333345', (SELECT id FROM specialties WHERE name = 'Neurology'), 'MD600345', 18),
  ('33333333-3333-3333-3333-333333333346', (SELECT id FROM specialties WHERE name = 'Neurology'), 'MD600346', 10),
  ('33333333-3333-3333-3333-333333333347', (SELECT id FROM specialties WHERE name = 'Neurology'), 'MD600347', 23),
  ('33333333-3333-3333-3333-333333333348', (SELECT id FROM specialties WHERE name = 'Neurology'), 'MD600348', 7),

  -- Psychiatry (5 doctors)
  ('33333333-3333-3333-3333-333333333349', (SELECT id FROM specialties WHERE name = 'Psychiatry'), 'MD700349', 11),
  ('33333333-3333-3333-3333-333333333350', (SELECT id FROM specialties WHERE name = 'Psychiatry'), 'MD700350', 16),
  ('33333333-3333-3333-3333-333333333351', (SELECT id FROM specialties WHERE name = 'Psychiatry'), 'MD700351', 9),
  ('33333333-3333-3333-3333-333333333352', (SELECT id FROM specialties WHERE name = 'Psychiatry'), 'MD700352', 19),
  ('33333333-3333-3333-3333-333333333353', (SELECT id FROM specialties WHERE name = 'Psychiatry'), 'MD700353', 13),

  -- Gynecology (5 doctors)
  ('33333333-3333-3333-3333-333333333354', (SELECT id FROM specialties WHERE name = 'Gynecology'), 'MD800354', 12),
  ('33333333-3333-3333-3333-333333333355', (SELECT id FROM specialties WHERE name = 'Gynecology'), 'MD800355', 17),
  ('33333333-3333-3333-3333-333333333356', (SELECT id FROM specialties WHERE name = 'Gynecology'), 'MD800356', 8),
  ('33333333-3333-3333-3333-333333333357', (SELECT id FROM specialties WHERE name = 'Gynecology'), 'MD800357', 20),
  ('33333333-3333-3333-3333-333333333358', (SELECT id FROM specialties WHERE name = 'Gynecology'), 'MD800358', 14);