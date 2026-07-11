-- =============================
-- MIGRATION: NEW TABLES + COLUMNS
-- =============================
-- Run this in Supabase SQL Editor.
-- menu_items and addresses already exist, so we only ADD the missing pieces.

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- HERO SLIDES TABLE
CREATE TABLE IF NOT EXISTS hero_slides (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- STORY IMAGES TABLE
CREATE TABLE IF NOT EXISTS story_images (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ADD category_id COLUMN TO menu_items (if missing)
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL;

-- RLS FOR NEW TABLES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_images ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories"
  ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read hero_slides" ON hero_slides;
CREATE POLICY "Public read hero_slides"
  ON hero_slides FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read story_images" ON story_images;
CREATE POLICY "Public read story_images"
  ON story_images FOR SELECT USING (true);

-- AUTH POLICIES
DROP POLICY IF EXISTS "Auth all categories" ON categories;
CREATE POLICY "Auth all categories"
  ON categories FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth all hero_slides" ON hero_slides;
CREATE POLICY "Auth all hero_slides"
  ON hero_slides FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth all story_images" ON story_images;
CREATE POLICY "Auth all story_images"
  ON story_images FOR ALL USING (auth.role() = 'authenticated');

-- STORAGE BUCKETS (hero-images, story-images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true),
       ('story-images', 'story-images', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
DROP POLICY IF EXISTS "Public read hero-images" ON storage.objects;
CREATE POLICY "Public read hero-images"
  ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');
DROP POLICY IF EXISTS "Public read story-images" ON storage.objects;
CREATE POLICY "Public read story-images"
  ON storage.objects FOR SELECT USING (bucket_id = 'story-images');
DROP POLICY IF EXISTS "Auth upload hero-images" ON storage.objects;
CREATE POLICY "Auth upload hero-images"
  ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth delete hero-images" ON storage.objects;
CREATE POLICY "Auth delete hero-images"
  ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth upload story-images" ON storage.objects;
CREATE POLICY "Auth upload story-images"
  ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth delete story-images" ON storage.objects;
CREATE POLICY "Auth delete story-images"
  ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');
