-- =============================
-- MIGRATION: COMING SOON FOR MENU ITEMS
-- Run this in Supabase SQL Editor.
-- =============================

-- ADD is_coming_soon COLUMN TO menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_coming_soon BOOLEAN DEFAULT false;

-- UPDATE EXISTING ITEMS TO EXPLICITLY BE false (optional, already defaults)
UPDATE menu_items SET is_coming_soon = false WHERE is_coming_soon IS NULL;
