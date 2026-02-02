-- Check if admin user exists
SELECT id, email, "fullName", role, status, provider, "createdAt"
FROM "users"
WHERE email = 'admin@sporthub.com';
