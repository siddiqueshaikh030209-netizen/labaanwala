-- =============================
-- LABAANWALA SUPABASE SCHEMA
-- =============================

-- MENU ITEMS TABLE
CREATE TABLE menu_items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  price DECIMAL(10, 2),
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
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
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- PUBLIC CAN READ
CREATE POLICY "Public read menu_items"
  ON menu_items FOR SELECT
  USING (true);

CREATE POLICY "Public read addresses"
  ON addresses FOR SELECT
  USING (true);

-- ONLY AUTHENTICATED USERS CAN WRITE
CREATE POLICY "Auth insert menu_items"
  ON menu_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update menu_items"
  ON menu_items FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete menu_items"
  ON menu_items FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update addresses"
  ON addresses FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete addresses"
  ON addresses FOR DELETE
  USING (auth.role() = 'authenticated');

-- STORAGE BUCKET FOR MENU IMAGES
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- PUBLIC CAN READ STORAGE
CREATE POLICY "Public read menu-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

-- AUTH CAN UPLOAD TO STORAGE
CREATE POLICY "Auth upload menu-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'menu-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete menu-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
