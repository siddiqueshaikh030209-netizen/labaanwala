-- =============================
-- MIGRATION: REVIEWS TABLE
-- Run this in Supabase SQL Editor.
-- =============================

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- PUBLIC CAN INSERT (submit reviews)
DROP POLICY IF EXISTS "Public insert reviews" ON reviews;
CREATE POLICY "Public insert reviews"
  ON reviews FOR INSERT WITH CHECK (true);

-- PUBLIC CAN READ ONLY APPROVED REVIEWS
DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;
CREATE POLICY "Public read approved reviews"
  ON reviews FOR SELECT USING (is_approved = true);

-- AUTHENTICATED USERS CAN READ ALL REVIEWS
DROP POLICY IF EXISTS "Auth read all reviews" ON reviews;
CREATE POLICY "Auth read all reviews"
  ON reviews FOR SELECT USING (auth.role() = 'authenticated');

-- AUTHENTICATED USERS CAN UPDATE REVIEWS (approve/reject)
DROP POLICY IF EXISTS "Auth update reviews" ON reviews;
CREATE POLICY "Auth update reviews"
  ON reviews FOR UPDATE USING (auth.role() = 'authenticated');

-- AUTHENTICATED USERS CAN DELETE REVIEWS
DROP POLICY IF EXISTS "Auth delete reviews" ON reviews;
CREATE POLICY "Auth delete reviews"
  ON reviews FOR DELETE USING (auth.role() = 'authenticated');
