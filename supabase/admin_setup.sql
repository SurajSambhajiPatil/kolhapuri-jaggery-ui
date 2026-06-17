-- ================================================================
-- GUDORA FOODS — Admin Role Setup
-- ================================================================
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query
-- After running, manually grant yourself admin (see bottom of file)
-- ================================================================


-- ── 1. Add is_admin column ───────────────────────────────────────
ALTER TABLE customer_profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_cp_admin ON customer_profiles (user_id) WHERE is_admin = TRUE;


-- ── 2. Helper function to check admin (avoids recursive RLS) ─────
-- SECURITY DEFINER lets it bypass RLS when reading customer_profiles
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM customer_profiles WHERE user_id = auth.uid() LIMIT 1),
    FALSE
  );
$$;

GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;


-- ── 3. Admin can see ALL orders ──────────────────────────────────
DROP POLICY IF EXISTS "orders_select_admin" ON orders;
CREATE POLICY "orders_select_admin" ON orders
  FOR SELECT USING (is_admin());

-- Admin can update order status (and any other field)
DROP POLICY IF EXISTS "orders_update_admin" ON orders;
CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE USING (is_admin());


-- ── 4. Admin can see ALL order_items ────────────────────────────
DROP POLICY IF EXISTS "oi_select_admin" ON order_items;
CREATE POLICY "oi_select_admin" ON order_items
  FOR SELECT USING (is_admin());


-- ── 5. Fix: allow users to DELETE their own addresses ───────────
-- (no delete policy existed — needed by Profile.jsx address removal)
DROP POLICY IF EXISTS "ca_delete" ON customer_addresses;
CREATE POLICY "ca_delete" ON customer_addresses
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM customer_profiles cp
      WHERE cp.id = customer_id
        AND (cp.user_id = auth.uid() OR cp.user_id IS NULL)
    )
    OR is_admin()
  );


-- ── 6. Admin can see ALL customer_profiles ───────────────────────
DROP POLICY IF EXISTS "cp_select_admin" ON customer_profiles;
CREATE POLICY "cp_select_admin" ON customer_profiles
  FOR SELECT USING (is_admin());


-- ================================================================
-- GRANT YOURSELF ADMIN
-- ================================================================
-- After running the above, find your user_id in:
--   Supabase Dashboard → Authentication → Users → copy your User UID
-- Then run this query (replace the UUID):
--
-- UPDATE customer_profiles
-- SET is_admin = TRUE
-- WHERE user_id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
--
-- Verify it worked:
-- SELECT user_id, full_name, is_admin FROM customer_profiles WHERE is_admin = TRUE;
-- ================================================================
