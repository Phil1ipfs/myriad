-- Add all doctor specializations to the fields table
-- This script adds all the specializations if they don't already exist

-- First, update "General Medicine" to "General Practitioner" if it exists
UPDATE fields 
SET name = 'General Practitioner', "updatedAt" = NOW()
WHERE name = 'General Medicine';

-- Add new specializations (using NOT EXISTS to avoid duplicates)
INSERT INTO fields (name, type, required, "createdAt", "updatedAt") 
SELECT 'General Practitioner', 'medical', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name = 'General Practitioner');

INSERT INTO fields (name, type, required, "createdAt", "updatedAt") 
SELECT 'Pediatrician', 'medical', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name = 'Pediatrician');

INSERT INTO fields (name, type, required, "createdAt", "updatedAt") 
SELECT 'Obstetrician-Gynecologist', 'medical', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name = 'Obstetrician-Gynecologist');

INSERT INTO fields (name, type, required, "createdAt", "updatedAt") 
SELECT 'Dermatologist', 'medical', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name = 'Dermatologist');

INSERT INTO fields (name, type, required, "createdAt", "updatedAt") 
SELECT 'Cardiologist', 'medical', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name = 'Cardiologist');

INSERT INTO fields (name, type, required, "createdAt", "updatedAt") 
SELECT 'Ophthalmologist', 'medical', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name = 'Ophthalmologist');

INSERT INTO fields (name, type, required, "createdAt", "updatedAt") 
SELECT 'Dentist', 'medical', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name = 'Dentist');

INSERT INTO fields (name, type, required, "createdAt", "updatedAt") 
SELECT 'ENT Specialist', 'medical', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name = 'ENT Specialist');

INSERT INTO fields (name, type, required, "createdAt", "updatedAt") 
SELECT 'Psychiatrist', 'medical', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name = 'Psychiatrist');

INSERT INTO fields (name, type, required, "createdAt", "updatedAt") 
SELECT 'Gastroenterologist', 'medical', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name = 'Gastroenterologist');

