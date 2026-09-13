-- Migration: 20260913000000_create_bookmarks_table.sql
-- Description: Create bookmarks table with Row Level Security (RLS) policies for user readings

-- 1. Create table bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    surah_id INT NOT NULL,
    surah_name TEXT NOT NULL,
    arabic_name TEXT NOT NULL,
    translation TEXT NOT NULL,
    verse_count INT NOT NULL,
    verse_number INT DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_bookmark UNIQUE (user_id)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- 3. Security Policies
CREATE POLICY "Users can view their own bookmark"
    ON public.bookmarks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmark"
    ON public.bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmark"
    ON public.bookmarks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmark"
    ON public.bookmarks FOR DELETE
    USING (auth.uid() = user_id);
