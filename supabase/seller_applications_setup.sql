-- ================================================================
-- GUDORA FOODS — Seller Applications Table
-- ================================================================
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- Requires admin_setup.sql to have been run first (uses is_admin())
-- ================================================================

CREATE TABLE IF NOT EXISTS seller_applications (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Business info
  business_name     TEXT        NOT NULL,
  business_type     TEXT        NOT NULL,  -- retail | wholesale | online | distributor | supermarket
  gstin             TEXT,
  website           TEXT,

  -- Contact info
  owner_name        TEXT        NOT NULL,
  email             TEXT        NOT NULL,
  mobile            TEXT        NOT NULL,

  -- Location
  address           TEXT,
  city              TEXT        NOT NULL,
  state             TEXT        NOT NULL,
  pincode           TEXT        NOT NULL,

  -- Partnership details
  preferred_channel TEXT        NOT NULL,  -- whatsapp | email | phone
  monthly_capacity  TEXT        NOT NULL,  -- small | medium | large | bulk
  products_interest TEXT[]      NOT NULL DEFAULT '{}',

  -- Additional
  message           TEXT,

  -- Admin management
  status            TEXT        NOT NULL DEFAULT 'pending',  -- pending | reviewing | approved | rejected
  admin_notes       TEXT,
  applied_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_seller_email   ON seller_applications (email);
CREATE INDEX IF NOT EXISTS idx_seller_status  ON seller_applications (status, applied_at DESC);
CREATE INDEX IF NOT EXISTS idx_seller_applied ON seller_applications (applied_at DESC);

ALTER TABLE seller_applications ENABLE ROW LEVEL SECURITY;

-- Anyone (guest or logged-in) can submit an application
DROP POLICY IF EXISTS "seller_insert" ON seller_applications;
CREATE POLICY "seller_insert" ON seller_applications
  FOR INSERT WITH CHECK (true);

-- Admin can read all applications
DROP POLICY IF EXISTS "seller_select_admin" ON seller_applications;
CREATE POLICY "seller_select_admin" ON seller_applications
  FOR SELECT USING (is_admin());

-- Admin can update status and notes
DROP POLICY IF EXISTS "seller_update_admin" ON seller_applications;
CREATE POLICY "seller_update_admin" ON seller_applications
  FOR UPDATE USING (is_admin());

-- Admin can delete rejected / spam applications
DROP POLICY IF EXISTS "seller_delete_admin" ON seller_applications;
CREATE POLICY "seller_delete_admin" ON seller_applications
  FOR DELETE USING (is_admin());
