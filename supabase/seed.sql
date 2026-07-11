-- =============================
-- SEED DATA FOR LABAANWALA
-- =============================

-- CREATE ADMIN USER (run this in Supabase Auth UI, not SQL)
-- Email: admin@labaanwala.com
-- Password: admin123

-- SEED CATEGORIES
INSERT INTO categories (name, sort_order) VALUES
('Signature', 1),
('Classic', 2),
('Cakes', 3),
('Aseeratul', 4);

-- SEED MENU ITEMS (with category_id FK)
INSERT INTO menu_items (name, description, image_url, category, category_id) VALUES
('Salankatia', 'Smooth vanilla custard, moist vanilla cake, crispy kataifi, and your choice of Pistachio, Hazelnut, Kinder, or Biscoff create a perfectly balanced dessert.', NULL, 'Signature', 1),
('Qashtuta', 'Traditional milk-soaked cake topped with layers of pistachio, nutella, and fresh cream.', NULL, 'Classic', 2),
('Lou''a', 'Silky chocolate cream base bowl loaded with fresh strawberries and roasted pistachios.', NULL, 'Signature', 1),
('Koushri', 'An indulgent layers of dual-flavor creams, crunchy pastry, and hazelnut topping.', NULL, 'Classic', 2),
('Heba Cake', 'Rich chocolate tray cake swirled with pistachio cream and topped with roasted nuts.', NULL, 'Cakes', 3),
('Kabsa', 'Crispy kataifi layered with choco pops, hazelnut spread, and mixed nuts delivers a satisfying blend of crunch and sweetness.', NULL, 'Signature', 1),
('Fazea Chocola Cake', 'Layers of rich brownie, creamy chocolate spread, crispy baklava, and choco chips come together for the ultimate chocolate indulgence.', NULL, 'Cakes', 3),
('Cheese Bomb', 'Crispy kataifi filled with melted cheese, rich hazelnut spread, and crushed pistachios creates an irresistible mix of creamy, crunchy, and nutty flavors.', NULL, 'Signature', 1),
('Aseeratul Nutella', 'Rich, thick traditional milk dessert cup loaded with Nutella hazelnut cream swirl.', NULL, 'Aseeratul', 4),
('Aseeratul Pistachio', 'Rich, thick traditional milk dessert cup loaded with luxury pistachio cream swirl.', NULL, 'Aseeratul', 4),
('Aseeratul Kinder', 'Rich, thick traditional milk dessert cup loaded with cashews and Kinder chocolate bars.', NULL, 'Aseeratul', 4),
('Aseeratul Lotus', 'Rich, thick traditional milk dessert cup loaded with Lotus Biscoff crumble & caramel drizzle.', NULL, 'Aseeratul', 4);

-- SEED HERO SLIDES (migrated from hardcoded HTML)
INSERT INTO hero_slides (name, image_url, sort_order) VALUES
('Salankatia', NULL, 1),
('Qashtuta', NULL, 2),
('Lou''a', NULL, 3),
('Koushri', NULL, 4),
('Heba Cake', NULL, 5),
('Fazea Chocola Cake', NULL, 6),
('Kabsa', NULL, 7),
('Cheese Bomb', NULL, 8),
('Aseeratul Pistachio', NULL, 9),
('Aseeratul Lotus', NULL, 10);

-- SEED STORY IMAGES (migrated from hardcoded HTML)
INSERT INTO story_images (image_url, sort_order) VALUES
(NULL, 1);

-- SEED ADDRESSES
INSERT INTO addresses (name, phone, address_text, map_embed_url, is_primary) VALUES (
  'Main Store – Kondhwa',
  '+91 97307 38285',
  'Shop No 1, Bhagwat Sankul, Salunke Vihar Rd, Opp. B G Lonkar Road, Kondhwa, Pune, Maharashtra 411048',
  'https://maps.google.com/maps?q=Shop+No+1,+Bhagwat+Sankul,+Salunke+Vihar+Rd,+Kondhwa,+Pune,+Maharashtra+411048&t=&z=16&ie=UTF8&iwloc=&output=embed',
  true
);
