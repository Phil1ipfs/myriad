-- Clear existing fields first (optional - comment out if you want to keep existing ones)
-- TRUNCATE TABLE fields CASCADE;

-- Insert all medical specializations
INSERT INTO fields (name, type, required, "createdAt", "updatedAt") VALUES
('General Practitioner', 'medical', true, NOW(), NOW()),
('Pediatrician', 'medical', true, NOW(), NOW()),
('Obstetrician-Gynecologist', 'medical', true, NOW(), NOW()),
('Dermatologist', 'medical', true, NOW(), NOW()),
('Cardiologist', 'medical', true, NOW(), NOW()),
('Ophthalmologist', 'medical', true, NOW(), NOW()),
('Dentist', 'medical', true, NOW(), NOW()),
('ENT Specialist', 'medical', true, NOW(), NOW()),
('Psychiatrist', 'medical', true, NOW(), NOW()),
('Gastroenterologist', 'medical', true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
