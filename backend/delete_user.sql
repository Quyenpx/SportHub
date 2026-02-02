-- Script SQL xóa user theo email
-- Thay 'your_email@example.com' bằng email của bạn

-- Bước 1: Xóa các bookings liên quan
DELETE FROM bookings WHERE user_id IN (SELECT id FROM users WHERE email = 'your_email@example.com');

-- Bước 2: Xóa các notifications liên quan
DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE email = 'your_email@example.com');

-- Bước 3: Xóa các venues (nếu user là owner)
DELETE FROM courts WHERE venue_id IN (SELECT id FROM venues WHERE owner_id IN (SELECT id FROM users WHERE email = 'your_email@example.com'));
DELETE FROM venues WHERE owner_id IN (SELECT id FROM users WHERE email = 'your_email@example.com');

-- Bước 4: Xóa user
DELETE FROM users WHERE email = 'your_email@example.com';

-- Hoặc xóa TẤT CẢ users (CẢNH BÁO: Xóa toàn bộ dữ liệu)
-- TRUNCATE TABLE bookings CASCADE;
-- TRUNCATE TABLE notifications CASCADE;
-- TRUNCATE TABLE courts CASCADE;
-- TRUNCATE TABLE venues CASCADE;
-- TRUNCATE TABLE users CASCADE;
