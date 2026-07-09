-- Update menu item image URLs after uploading to Supabase Storage
-- Run this AFTER uploading the 12 product images to the menu-images bucket

UPDATE menu_items SET image_url = 'https://lcxiruybhhvbyrvugzsr.supabase.co/storage/v1/object/public/menu-images/Salankatia.jpeg' WHERE name = 'Salankatia';
UPDATE menu_items SET image_url = 'https://lcxiruybhhvbyrvugzsr.supabase.co/storage/v1/object/public/menu-images/Qashtuta.jpeg' WHERE name = 'Qashtuta';
UPDATE menu_items SET image_url = 'https://lcxiruybhhvbyrvugzsr.supabase.co/storage/v1/object/public/menu-images/LOU%27A.jpeg' WHERE name = 'Lou''a';
UPDATE menu_items SET image_url = 'https://lcxiruybhhvbyrvugzsr.supabase.co/storage/v1/object/public/menu-images/koushri.jpeg' WHERE name = 'Koushri';
UPDATE menu_items SET image_url = 'https://lcxiruybhhvbyrvugzsr.supabase.co/storage/v1/object/public/menu-images/Heba%20Cake.jpeg' WHERE name = 'Heba Cake';
UPDATE menu_items SET image_url = 'https://lcxiruybhhvbyrvugzsr.supabase.co/storage/v1/object/public/menu-images/Kabsa.jpeg' WHERE name = 'Kabsa';
UPDATE menu_items SET image_url = 'https://lcxiruybhhvbyrvugzsr.supabase.co/storage/v1/object/public/menu-images/Fazea%20Chocola%20Cake.jpeg' WHERE name = 'Fazea Chocola Cake';
UPDATE menu_items SET image_url = 'https://lcxiruybhhvbyrvugzsr.supabase.co/storage/v1/object/public/menu-images/Cheese%20Bomb.jpeg' WHERE name = 'Cheese Bomb';
UPDATE menu_items SET image_url = 'https://lcxiruybhhvbyrvugzsr.supabase.co/storage/v1/object/public/menu-images/Aseeratul%20Nutella.jpeg' WHERE name = 'Aseeratul Nutella';
UPDATE menu_items SET image_url = 'https://lcxiruybhhvbyrvugzsr.supabase.co/storage/v1/object/public/menu-images/aseeratul%20pistachio.jpeg' WHERE name = 'Aseeratul Pistachio';
UPDATE menu_items SET image_url = 'https://lcxiruybhhvbyrvugzsr.supabase.co/storage/v1/object/public/menu-images/Aseeratul%20Kinder.jpeg' WHERE name = 'Aseeratul Kinder';
UPDATE menu_items SET image_url = 'https://lcxiruybhhvbyrvugzsr.supabase.co/storage/v1/object/public/menu-images/Aseeratul%20Lotus.jpeg' WHERE name = 'Aseeratul Lotus';
