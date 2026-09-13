-- Migration: 20260913000001_multiple_bookmarks.sql
-- Description: Allow users to store multiple bookmarks (composite unique key on user_id, surah_id, verse_number)

-- Remove old constraint if exists
ALTER TABLE public.bookmarks DROP CONSTRAINT IF EXISTS unique_user_bookmark;

-- Add new composite unique constraint so user can bookmark multiple different verses
ALTER TABLE public.bookmarks ADD CONSTRAINT unique_user_verse_bookmark UNIQUE (user_id, surah_id, verse_number);
