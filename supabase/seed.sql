-- =============================
-- SEED DATA FOR LABAANWALA
-- =============================
-- Run this AFTER migration.sql in Supabase SQL Editor.

-- CREATE ADMIN USER (run this in Supabase Auth UI, not SQL)
-- Email: admin@labaanwala.com
-- Password: admin123

-- SEED CATEGORIES
INSERT INTO categories (name, sort_order) VALUES
('Signature', 1),
('Classic', 2),
('Cakes', 3),
('Aseeratul', 4)
ON CONFLICT DO NOTHING;

-- UPDATE EXISTING MENU ITEMS WITH IMAGE_URL AND category_id
UPDATE menu_items SET image_url = 'assets/images/hero bg/Salankatia.jpeg', category_id = 1 WHERE name = 'Salankatia';
UPDATE menu_items SET image_url = 'assets/images/hero bg/Qashtuta.jpeg', category_id = 2 WHERE name = 'Qashtuta';
UPDATE menu_items SET image_url = 'assets/images/hero bg/LOU''A.jpeg', category_id = 1 WHERE name = 'Lou''a';
UPDATE menu_items SET image_url = 'assets/images/hero bg/koushri.jpeg', category_id = 2 WHERE name = 'Koushri';
UPDATE menu_items SET image_url = 'assets/images/hero bg/Heba Cake.jpeg', category_id = 3 WHERE name = 'Heba Cake';
UPDATE menu_items SET image_url = 'assets/images/hero bg/Kabsa.jpeg', category_id = 1 WHERE name = 'Kabsa';
UPDATE menu_items SET image_url = 'assets/images/hero bg/Fazea Chocola Cake.jpeg', category_id = 3 WHERE name = 'Fazea Chocola Cake';
UPDATE menu_items SET image_url = 'assets/images/hero bg/Cheese Bomb.jpeg', category_id = 1 WHERE name = 'Cheese Bomb';
UPDATE menu_items SET image_url = 'assets/images/hero bg/Aseeratul Nutella.jpeg', category_id = 4 WHERE name = 'Aseeratul Nutella';
UPDATE menu_items SET image_url = 'assets/images/hero bg/aseeratul pistachio.jpeg', category_id = 4 WHERE name = 'Aseeratul Pistachio';
UPDATE menu_items SET image_url = 'assets/images/hero bg/Aseeratul Kinder.jpeg', category_id = 4 WHERE name = 'Aseeratul Kinder';
UPDATE menu_items SET image_url = 'assets/images/hero bg/Aseeratul Lotus.jpeg', category_id = 4 WHERE name = 'Aseeratul Lotus';

-- SEED HERO SLIDES
INSERT INTO hero_slides (name, image_url, sort_order) VALUES
('Salankatia', 'assets/images/hero bg/Salankatia.jpeg', 1),
('Qashtuta', 'assets/images/hero bg/Qashtuta.jpeg', 2),
('Lou''a', 'assets/images/hero bg/LOU''A.jpeg', 3),
('Koushri', 'assets/images/hero bg/koushri.jpeg', 4),
('Heba Cake', 'assets/images/hero bg/Heba Cake.jpeg', 5),
('Fazea Chocola Cake', 'assets/images/hero bg/Fazea Chocola Cake.jpeg', 6),
('Kabsa', 'assets/images/hero bg/Kabsa.jpeg', 7),
('Cheese Bomb', 'assets/images/hero bg/Cheese Bomb.jpeg', 8),
('Aseeratul Pistachio', 'assets/images/hero bg/aseeratul pistachio.jpeg', 9),
('Aseeratul Lotus', 'assets/images/hero bg/Aseeratul Lotus.jpeg', 10)
ON CONFLICT DO NOTHING;

-- SEED STORY IMAGES
INSERT INTO story_images (image_url, sort_order) VALUES
('assets/images/story/WhatsApp Image 2026-07-06 at 23.40.41.jpeg', 1)
ON CONFLICT DO NOTHING;

-- SEED ADDRESSES (skip if already exists)
INSERT INTO addresses (name, phone, address_text, map_embed_url, is_primary)
SELECT 'Main Store – Kondhwa', '+91 97307 38285', 'Shop No 1, Bhagwat Sankul, Salunke Vihar Rd, Opp. B G Lonkar Road, Kondhwa, Pune, Maharashtra 411048', 'https://maps.google.com/maps?q=Shop+No+1,+Bhagwat+Sankul,+Salunke+Vihar+Rd,+Kondhwa,+Pune,+Maharashtra+411048&t=&z=16&ie=UTF8&iwloc=&output=embed', true
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE name = 'Main Store – Kondhwa');
