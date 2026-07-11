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
('Salankatia', 'Smooth vanilla custard, moist vanilla cake, crispy kataifi, and your choice of Pistachio, Hazelnut, Kinder, or Biscoff create a perfectly balanced dessert.', 'assets/images/hero bg/Salankatia.jpeg', 'Signature', 1),
('Qashtuta', 'Traditional milk-soaked cake topped with layers of pistachio, nutella, and fresh cream.', 'assets/images/hero bg/Qashtuta.jpeg', 'Classic', 2),
('Lou''a', 'Silky chocolate cream base bowl loaded with fresh strawberries and roasted pistachios.', 'assets/images/hero bg/LOU''A.jpeg', 'Signature', 1),
('Koushri', 'An indulgent layers of dual-flavor creams, crunchy pastry, and hazelnut topping.', 'assets/images/hero bg/koushri.jpeg', 'Classic', 2),
('Heba Cake', 'Rich chocolate tray cake swirled with pistachio cream and topped with roasted nuts.', 'assets/images/hero bg/Heba Cake.jpeg', 'Cakes', 3),
('Kabsa', 'Crispy kataifi layered with choco pops, hazelnut spread, and mixed nuts delivers a satisfying blend of crunch and sweetness.', 'assets/images/hero bg/Kabsa.jpeg', 'Signature', 1),
('Fazea Chocola Cake', 'Layers of rich brownie, creamy chocolate spread, crispy baklava, and choco chips come together for the ultimate chocolate indulgence.', 'assets/images/hero bg/Fazea Chocola Cake.jpeg', 'Cakes', 3),
('Cheese Bomb', 'Crispy kataifi filled with melted cheese, rich hazelnut spread, and crushed pistachios creates an irresistible mix of creamy, crunchy, and nutty flavors.', 'assets/images/hero bg/Cheese Bomb.jpeg', 'Signature', 1),
('Aseeratul Nutella', 'Rich, thick traditional milk dessert cup loaded with Nutella hazelnut cream swirl.', 'assets/images/hero bg/Aseeratul Nutella.jpeg', 'Aseeratul', 4),
('Aseeratul Pistachio', 'Rich, thick traditional milk dessert cup loaded with luxury pistachio cream swirl.', 'assets/images/hero bg/aseeratul pistachio.jpeg', 'Aseeratul', 4),
('Aseeratul Kinder', 'Rich, thick traditional milk dessert cup loaded with cashews and Kinder chocolate bars.', 'assets/images/hero bg/Aseeratul Kinder.jpeg', 'Aseeratul', 4),
('Aseeratul Lotus', 'Rich, thick traditional milk dessert cup loaded with Lotus Biscoff crumble & caramel drizzle.', 'assets/images/hero bg/Aseeratul Lotus.jpeg', 'Aseeratul', 4);

-- SEED HERO SLIDES (migrated from hardcoded HTML)
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
('Aseeratul Lotus', 'assets/images/hero bg/Aseeratul Lotus.jpeg', 10);

-- SEED STORY IMAGES (migrated from hardcoded HTML)
INSERT INTO story_images (image_url, sort_order) VALUES
('assets/images/story/WhatsApp Image 2026-07-06 at 23.40.41.jpeg', 1);

-- SEED ADDRESSES
INSERT INTO addresses (name, phone, address_text, map_embed_url, is_primary) VALUES (
  'Main Store – Kondhwa',
  '+91 97307 38285',
  'Shop No 1, Bhagwat Sankul, Salunke Vihar Rd, Opp. B G Lonkar Road, Kondhwa, Pune, Maharashtra 411048',
  'https://maps.google.com/maps?q=Shop+No+1,+Bhagwat+Sankul,+Salunke+Vihar+Rd,+Kondhwa,+Pune,+Maharashtra+411048&t=&z=16&ie=UTF8&iwloc=&output=embed',
  true
);
