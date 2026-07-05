-- Supplement Directory Schema
-- Run this in your Supabase SQL Editor

-- Influencers table
CREATE TABLE IF NOT EXISTS influencers (
    id              TEXT PRIMARY KEY,        -- slug: "andrew-huberman"
    full_name       TEXT NOT NULL,
    channel_name    TEXT NOT NULL,
    channel_url     TEXT NOT NULL,
    subscriber_count TEXT,
    subs_checked_date DATE,
    bio             TEXT,
    profile_image_url TEXT,
    category_tags   TEXT[] DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Supplements table (master list of unique products)
CREATE TABLE IF NOT EXISTS supplements (
    id              SERIAL PRIMARY KEY,
    product_name    TEXT NOT NULL,
    brand           TEXT NOT NULL,
    category        TEXT NOT NULL,
    form            TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_name, brand)
);

-- Junction: which influencer takes which supplement
CREATE TABLE IF NOT EXISTS influencer_supplements (
    id                  SERIAL PRIMARY KEY,
    influencer_id       TEXT REFERENCES influencers(id) ON DELETE CASCADE,
    supplement_id       INTEGER REFERENCES supplements(id) ON DELETE CASCADE,
    dosage              TEXT,
    frequency           TEXT,
    timing              TEXT,
    source_video_title  TEXT,
    source_video_url    TEXT NOT NULL,
    source_timestamp    TEXT,
    source_date         DATE,
    transcript_excerpt  TEXT,
    is_sponsored        BOOLEAN DEFAULT FALSE,
    is_own_brand        BOOLEAN DEFAULT FALSE,
    has_affiliate_link  BOOLEAN DEFAULT FALSE,
    affiliate_details   TEXT,
    confidence          TEXT DEFAULT 'medium',
    notes               TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_influencer_supplements_influencer 
    ON influencer_supplements(influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_supplements_supplement 
    ON influencer_supplements(supplement_id);
CREATE INDEX IF NOT EXISTS idx_supplements_brand 
    ON supplements(brand);
CREATE INDEX IF NOT EXISTS idx_supplements_category 
    ON supplements(category);

-- Enable Row Level Security
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_supplements ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read on influencers"
    ON influencers FOR SELECT USING (true);

CREATE POLICY "Allow public read on supplements"
    ON supplements FOR SELECT USING (true);

CREATE POLICY "Allow public read on influencer_supplements"
    ON influencer_supplements FOR SELECT USING (true);