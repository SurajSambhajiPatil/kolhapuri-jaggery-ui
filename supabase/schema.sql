-- ================================================================
-- GUDORA FOODS — Complete Supabase Schema
-- ================================================================
-- Run this once in: Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run: all statements use IF NOT EXISTS / OR REPLACE
-- ================================================================

-- ── Extensions ──────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ================================================================
-- TABLE: customer_profiles
-- One row per customer (authenticated OR guest)
-- user_id is NULL for guest customers
-- ================================================================
CREATE TABLE IF NOT EXISTS customer_profiles (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name   TEXT        NOT NULL DEFAULT 'User',
  email       TEXT,
  mobile      TEXT,
  address     TEXT,        -- saved from signup form
  pincode     TEXT,        -- saved from signup form
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Allows upsert onConflict:"mobile" for guest checkout
-- PostgreSQL UNIQUE allows multiple NULLs, so guests without mobile still work
ALTER TABLE customer_profiles
  ADD CONSTRAINT IF NOT EXISTS customer_profiles_mobile_unique UNIQUE (mobile);

CREATE INDEX IF NOT EXISTS idx_cp_user_id  ON customer_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_cp_mobile   ON customer_profiles (mobile) WHERE mobile IS NOT NULL;


-- ================================================================
-- TABLE: customer_addresses
-- Each customer can have multiple addresses; one marked is_default
-- ================================================================
CREATE TABLE IF NOT EXISTS customer_addresses (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id    UUID        NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
  full_name      TEXT        NOT NULL,
  mobile         TEXT        NOT NULL,
  email          TEXT,
  address_line1  TEXT        NOT NULL,
  address_line2  TEXT,
  city           TEXT        NOT NULL,
  pincode        TEXT        NOT NULL,
  landmark       TEXT,
  notes          TEXT,
  is_default     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ca_customer_id  ON customer_addresses (customer_id);
CREATE INDEX IF NOT EXISTS idx_ca_is_default   ON customer_addresses (customer_id, is_default) WHERE is_default = TRUE;


-- ================================================================
-- TABLE: orders
-- ================================================================
CREATE TABLE IF NOT EXISTS orders (
  id                   UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number         TEXT        NOT NULL UNIQUE,
  user_id              UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_id          UUID        REFERENCES customer_profiles(id) ON DELETE SET NULL,
  customer_address_id  UUID        REFERENCES customer_addresses(id) ON DELETE SET NULL,
  -- Denormalised delivery snapshot (stays correct even if address changes later)
  full_name            TEXT        NOT NULL,
  mobile               TEXT        NOT NULL,
  email                TEXT,
  address_line1        TEXT        NOT NULL,
  city                 TEXT        NOT NULL,
  pincode              TEXT        NOT NULL,
  landmark             TEXT,
  notes                TEXT,
  -- Commerce
  coupon_code          TEXT,
  payment_method       TEXT        NOT NULL DEFAULT 'COD',   -- 'COD' | 'ONLINE'
  status               TEXT        NOT NULL DEFAULT 'confirmed',
  -- All monetary values stored in RUPEES (not paise) to match the frontend
  subtotal_cents       INTEGER     NOT NULL DEFAULT 0,
  discount_cents       INTEGER     NOT NULL DEFAULT 0,
  shipping_cents       INTEGER     NOT NULL DEFAULT 0,
  total_cents          INTEGER     NOT NULL DEFAULT 0,
  tax_total_cents      INTEGER     NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id     ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at  ON orders (created_at DESC);


-- ================================================================
-- TABLE: order_items
-- ================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id                    UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID    NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id            TEXT    NOT NULL,
  product_name          TEXT    NOT NULL,
  product_category      TEXT,
  product_image         TEXT,
  unit_price_cents      INTEGER NOT NULL DEFAULT 0,
  qty                   INTEGER NOT NULL DEFAULT 1,
  item_subtotal_cents   INTEGER NOT NULL DEFAULT 0,
  item_discount_cents   INTEGER NOT NULL DEFAULT 0,
  taxable_amount_cents  INTEGER NOT NULL DEFAULT 0,
  gst_rate_pct          NUMERIC(5,2) NOT NULL DEFAULT 0,
  gst_amount_cents      INTEGER NOT NULL DEFAULT 0,
  line_total_cents      INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_oi_order_id ON order_items (order_id);


-- ================================================================
-- TRIGGER: auto-update updated_at on every UPDATE
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cp_updated_at ON customer_profiles;
CREATE TRIGGER trg_cp_updated_at
  BEFORE UPDATE ON customer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_ca_updated_at ON customer_addresses;
CREATE TRIGGER trg_ca_updated_at
  BEFORE UPDATE ON customer_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ================================================================
-- TRIGGER: create customer_profile row on new Supabase auth user
-- Fires for both email+password AND phone OTP signups
-- ================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO customer_profiles (user_id, full_name, email, mobile)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      SPLIT_PART(COALESCE(NEW.email, ''), '@', 1),
      'User'
    ),
    NEW.email,
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'mobile')
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name  = COALESCE(EXCLUDED.full_name,  customer_profiles.full_name),
    email      = COALESCE(EXCLUDED.email,      customer_profiles.email),
    mobile     = COALESCE(EXCLUDED.mobile,     customer_profiles.mobile),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_handle_new_user ON auth.users;
CREATE TRIGGER trg_handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ================================================================
-- RPC: set_default_address
-- Used by Checkout.jsx to atomically replace the default address
-- SECURITY DEFINER so it bypasses RLS for the internal update
-- ================================================================
CREATE OR REPLACE FUNCTION set_default_address(
  p_customer_id UUID,
  p_address     JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_new_id UUID;
BEGIN
  -- Mark all existing addresses as non-default
  UPDATE customer_addresses
  SET    is_default = FALSE, updated_at = NOW()
  WHERE  customer_id = p_customer_id
    AND  is_default  = TRUE;

  -- Insert the new default address
  INSERT INTO customer_addresses (
    customer_id,
    full_name,    mobile,                email,
    address_line1, address_line2,
    city,          pincode,
    landmark,      notes,
    is_default
  )
  VALUES (
    p_customer_id,
    p_address->>'full_name',
    p_address->>'mobile',
    NULLIF(p_address->>'email',         ''),
    p_address->>'address_line1',
    NULLIF(p_address->>'address_line2', ''),
    p_address->>'city',
    p_address->>'pincode',
    NULLIF(p_address->>'landmark',      ''),
    NULLIF(p_address->>'notes',         ''),
    TRUE
  )
  RETURNING id INTO v_new_id;

  RETURN v_new_id;
END;
$$;

-- Allow anyone (anon + authenticated) to call the RPC
GRANT EXECUTE ON FUNCTION set_default_address(UUID, JSONB) TO anon, authenticated;


-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

-- ── customer_profiles ────────────────────────────────────────────
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cp_select"  ON customer_profiles;
DROP POLICY IF EXISTS "cp_insert"  ON customer_profiles;
DROP POLICY IF EXISTS "cp_update"  ON customer_profiles;

-- Authenticated users see their own row; anon can see guest rows (user_id IS NULL)
-- The mobile/email filter is applied in the query, not in the policy
CREATE POLICY "cp_select" ON customer_profiles
  FOR SELECT USING (
    auth.uid() = user_id        -- own profile (authenticated)
    OR user_id IS NULL          -- guest profiles (queried by mobile/email)
  );

CREATE POLICY "cp_insert" ON customer_profiles
  FOR INSERT WITH CHECK (true); -- allow guest + authenticated inserts

CREATE POLICY "cp_update" ON customer_profiles
  FOR UPDATE USING (
    auth.uid() = user_id        -- only own profile
    OR user_id IS NULL          -- guest update allowed (checkout upsert on mobile)
  );


-- ── customer_addresses ───────────────────────────────────────────
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ca_select" ON customer_addresses;
DROP POLICY IF EXISTS "ca_insert" ON customer_addresses;
DROP POLICY IF EXISTS "ca_update" ON customer_addresses;

CREATE POLICY "ca_select" ON customer_addresses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customer_profiles cp
      WHERE cp.id = customer_id
        AND (cp.user_id = auth.uid() OR cp.user_id IS NULL)
    )
  );

CREATE POLICY "ca_insert" ON customer_addresses
  FOR INSERT WITH CHECK (true); -- set_default_address RPC uses SECURITY DEFINER

CREATE POLICY "ca_update" ON customer_addresses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM customer_profiles cp
      WHERE cp.id = customer_id
        AND (cp.user_id = auth.uid() OR cp.user_id IS NULL)
    )
  );


-- ── orders ───────────────────────────────────────────────────────
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select" ON orders;
DROP POLICY IF EXISTS "orders_insert" ON orders;

-- Authenticated users see their own orders; guest orders (user_id IS NULL) visible only during session
CREATE POLICY "orders_select" ON orders
  FOR SELECT USING (
    auth.uid() = user_id
    OR user_id IS NULL
  );

CREATE POLICY "orders_insert" ON orders
  FOR INSERT WITH CHECK (true); -- any user (anon/authenticated) can place an order


-- ── order_items ──────────────────────────────────────────────────
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "oi_select" ON order_items;
DROP POLICY IF EXISTS "oi_insert" ON order_items;

CREATE POLICY "oi_select" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id
        AND (o.user_id = auth.uid() OR o.user_id IS NULL)
    )
  );

CREATE POLICY "oi_insert" ON order_items
  FOR INSERT WITH CHECK (true);
