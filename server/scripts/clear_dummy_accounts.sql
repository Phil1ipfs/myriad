-- Clear all dummy accounts (emails ending with .dev@myriad.local)
-- This script deletes all related data for dummy accounts

BEGIN;

-- Find and delete dummy accounts
DO $$
DECLARE
    dummy_user RECORD;
    doctor_id_var INTEGER;
BEGIN
    -- Loop through all dummy users
    FOR dummy_user IN 
        SELECT user_id, email, role 
        FROM users 
        WHERE email LIKE '%.dev@myriad.local'
    LOOP
        RAISE NOTICE 'Deleting dummy account: % (role: %)', dummy_user.email, dummy_user.role;
        
        -- Delete role-specific data
        IF dummy_user.role = 'doctor' THEN
            -- Get doctor_id
            SELECT doctor_id INTO doctor_id_var 
            FROM doctors 
            WHERE user_id = dummy_user.user_id;
            
            IF doctor_id_var IS NOT NULL THEN
                -- Delete appointments
                DELETE FROM appointments WHERE doctor_id = doctor_id_var;
                
                -- Delete doctor availability
                DELETE FROM doctor_availabilities WHERE doctor_id = doctor_id_var;
            END IF;
            
            -- Delete doctor profile
            DELETE FROM doctors WHERE user_id = dummy_user.user_id;
            
        ELSIF dummy_user.role = 'client' THEN
            -- Delete appointments
            DELETE FROM appointments WHERE user_id = dummy_user.user_id;
            
            -- Delete client profile
            DELETE FROM clients WHERE user_id = dummy_user.user_id;
            
        ELSIF dummy_user.role = 'admin' THEN
            -- Delete admin profile
            DELETE FROM admins WHERE user_id = dummy_user.user_id;
        END IF;
        
        -- Delete common user-related data
        DELETE FROM comments WHERE user_id = dummy_user.user_id;
        DELETE FROM likes WHERE user_id = dummy_user.user_id;
        DELETE FROM notifications WHERE user_id = dummy_user.user_id;
        DELETE FROM messages WHERE sender_id = dummy_user.user_id OR receiver_id = dummy_user.user_id;
        DELETE FROM event_register WHERE user_id = dummy_user.user_id;
        DELETE FROM event_interests WHERE user_id = dummy_user.user_id;
        DELETE FROM otps WHERE user_id = dummy_user.user_id;
        
        -- Finally, delete the user
        DELETE FROM users WHERE user_id = dummy_user.user_id;
        
        RAISE NOTICE 'Successfully deleted: %', dummy_user.email;
    END LOOP;
    
    RAISE NOTICE 'Cleanup complete!';
END $$;

-- Show summary
SELECT 
    COUNT(*) as remaining_dummy_accounts
FROM users 
WHERE email LIKE '%.dev@myriad.local';

COMMIT;

