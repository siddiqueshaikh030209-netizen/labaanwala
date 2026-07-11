-- =============================
-- LABAANWALA SUPABASE SCHEMA
-- =============================

-- CATEGORIES TABLE
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- MENU ITEMS TABLE
CREATE TABLE menu_items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  price DECIMAL(10, 2),
  category TEXT,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- HERO SLIDES TABLE
CREATE TABLE hero_slides (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- STORY IMAGES TABLE
CREATE TABLE story_images (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ADDRESSES TABLE
CREATE TABLE addresses (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  address_text TEXT NOT NULL,
  map_embed_url TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AUTO-UPDATE updated_at TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ROW LEVEL SECURITY
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- PUBLIC CAN READ
CREATE POLICY "Public read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Public read menu_items"
  ON menu_items FOR SELECT USING (true);

CREATE POLICY "Public read hero_slides"
  ON hero_slides FOR SELECT USING (true);

CREATE POLICY "Public read story_images"
  ON story_images FOR SELECT USING (true);

CREATE POLICY "Public read addresses"
  ON addresses FOR SELECT USING (true);

-- ONLY AUTHENTICATED USERS CAN WRITE
CREATE POLICY "Auth all categories"
  ON categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert menu_items"
  ON menu_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update menu_items"
  ON menu_items FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete menu_items"
  ON menu_items FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth all hero_slides"
  ON hero_slides FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth all story_images"
  ON story_images FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert addresses"
  ON addresses FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update addresses"
  ON addresses FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete addresses"
  ON addresses FOR DELETE USING (auth.role() = 'authenticated');

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true),
       ('hero-images', 'hero-images', true),
       ('story-images', 'story-images', true)
ON CONFLICT (id) DO NOTHING;

-- PUBLIC CAN READ ALL BUCKETS
CREATE POLICY "Public read menu-images"
  ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');

CREATE POLICY "Public read hero-images"
  ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');

CREATE POLICY "Public read story-images"
  ON storage.objects FOR SELECT USING (bucket_id = 'story-images');

-- AUTH CAN UPLOAD/DELETE TO ALL BUCKETS
CREATE POLICY "Auth upload menu-images"
  ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth delete menu-images"
  ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth upload hero-images"
  ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth delete hero-images"
  ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth upload story-images"
  ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth delete story-images"
  ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');
