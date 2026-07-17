-- =============================
-- MIGRATION: EVENTS TABLE
-- Run this in Supabase SQL Editor.
-- =============================

-- EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  event_date DATE,
  event_type TEXT DEFAULT 'promotion' CHECK (event_type IN ('promotion', 'private_booking', 'special_offer', 'festival', 'new_launch')),
  badge_text TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- PUBLIC CAN READ ACTIVE EVENTS
DROP POLICY IF EXISTS "Public read active events" ON events;
CREATE POLICY "Public read active events"
  ON events FOR SELECT USING (is_active = true);

-- AUTHENTICATED USERS CAN READ ALL EVENTS
DROP POLICY IF EXISTS "Auth read all events" ON events;
CREATE POLICY "Auth read all events"
  ON events FOR SELECT USING (auth.role() = 'authenticated');

-- AUTHENTICATED USERS CAN INSERT EVENTS
DROP POLICY IF EXISTS "Auth insert events" ON events;
CREATE POLICY "Auth insert events"
  ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- AUTHENTICATED USERS CAN UPDATE EVENTS
DROP POLICY IF EXISTS "Auth update events" ON events;
CREATE POLICY "Auth update events"
  ON events FOR UPDATE USING (auth.role() = 'authenticated');

-- AUTHENTICATED USERS CAN DELETE EVENTS
DROP POLICY IF EXISTS "Auth delete events" ON events;
CREATE POLICY "Auth delete events"
  ON events FOR DELETE USING (auth.role() = 'authenticated');

-- STORAGE BUCKET FOR EVENT IMAGES
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- PUBLIC CAN READ EVENT IMAGES
DROP POLICY IF EXISTS "Public read event-images" ON storage.objects;
CREATE POLICY "Public read event-images"
  ON storage.objects FOR SELECT USING (bucket_id = 'event-images');

-- AUTH CAN UPLOAD/DELETE EVENT IMAGES
DROP POLICY IF EXISTS "Auth upload event-images" ON storage.objects;
CREATE POLICY "Auth upload event-images"
  ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth delete event-images" ON storage.objects;
CREATE POLICY "Auth delete event-images"
  ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');

-- SEED DATA: Sample events
INSERT INTO events (title, description, event_type, badge_text, is_active, sort_order, event_date)
VALUES
  ('Private Dessert Catering', 'Book Labaanwala for your weddings, birthdays, and corporate events. Custom dessert tables curated just for your celebration.', 'private_booking', 'Book Now', true, 1, NULL),
  ('Festival Special Offers', 'Celebrate every festival with exclusive dessert combos and limited-time flavors. Stay tuned for our seasonal specials.', 'festival', 'Limited Time', true, 2, NULL),
  ('New Launch: Pistachio Kunafa', 'Our brand-new Pistachio Kunafa is here! Layers of crispy kunafa, rich pistachio cream, and a golden honey drizzle.', 'new_launch', 'New', true, 3, '2026-07-20');
