-- =============================
-- SEED DATA FOR LABAANWALA
-- =============================

-- CREATE ADMIN USER (run this in Supabase Auth UI, not SQL)
-- Email: admin@labaanwala.com
-- Password: admin123

-- SEED MENU ITEMS
INSERT INTO menu_items (name, description, image_url, category) VALUES
('Salankatia', 'Smooth vanilla custard, moist vanilla cake, crispy kataifi, and your choice of Pistachio, Hazelnut, Kinder, or Biscoff create a perfectly balanced dessert.', NULL, 'Signature'),
('Qashtuta', 'Traditional milk-soaked cake topped with layers of pistachio, nutella, and fresh cream.', NULL, 'Classic'),
('Lou''a', 'Silky chocolate cream base bowl loaded with fresh strawberries and roasted pistachios.', NULL, 'Signature'),
('Koushri', 'An indulgent layers of dual-flavor creams, crunchy pastry, and hazelnut topping.', NULL, 'Classic'),
('Heba Cake', 'Rich chocolate tray cake swirled with pistachio cream and topped with roasted nuts.', NULL, 'Cakes'),
('Kabsa', 'Crispy kataifi layered with choco pops, hazelnut spread, and mixed nuts delivers a satisfying blend of crunch and sweetness.', NULL, 'Signature'),
('Fazea Chocola Cake', 'Layers of rich brownie, creamy chocolate spread, crispy baklava, and choco chips come together for the ultimate chocolate indulgence.', NULL, 'Cakes'),
('Cheese Bomb', 'Crispy kataifi filled with melted cheese, rich hazelnut spread, and crushed pistachios creates an irresistible mix of creamy, crunchy, and nutty flavors.', NULL, 'Signature'),
('Aseeratul Nutella', 'Rich, thick traditional milk dessert cup loaded with Nutella hazelnut cream swirl.', NULL, 'Aseeratul'),
('Aseeratul Pistachio', 'Rich, thick traditional milk dessert cup loaded with luxury pistachio cream swirl.', NULL, 'Aseeratul'),
('Aseeratul Kinder', 'Rich, thick traditional milk dessert cup loaded with cashews and Kinder chocolate bars.', NULL, 'Aseeratul'),
('Aseeratul Lotus', 'Rich, thick traditional milk dessert cup loaded with Lotus Biscoff crumble & caramel drizzle.', NULL, 'Aseeratul');

-- SEED ADDRESSES
INSERT INTO addresses (name, phone, address_text, map_embed_url, is_primary) VALUES (
  'Main Store – Kondhwa',
  '+91 97307 38285',
  'Shop No 1, Bhagwat Sankul, Salunke Vihar Rd, Opp. B G Lonkar Road, Kondhwa, Pune, Maharashtra 411048',
  'https://maps.google.com/maps?q=Shop+No+1,+Bhagwat+Sankul,+Salunke+Vihar+Rd,+Kondhwa,+Pune,+Maharashtra+411048&t=&z=16&ie=UTF8&iwloc=&output=embed',
  true
);
