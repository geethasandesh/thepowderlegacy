-- ==========================================
-- COUPON SYSTEM - SUPABASE DATABASE SCHEMA
-- ==========================================
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1. CREATE COUPONS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL CHECK (discount_value >= 0),
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  is_active boolean DEFAULT true,
  usage_type text NOT NULL CHECK (usage_type IN ('first_time_only', 'one_time_per_user', 'unlimited')),
  max_uses integer CHECK (max_uses IS NULL OR max_uses > 0),
  current_uses integer DEFAULT 0 CHECK (current_uses >= 0),
  min_order_amount numeric DEFAULT 0 CHECK (min_order_amount >= 0),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add comment to table
COMMENT ON TABLE coupons IS 'Stores discount coupon codes and their rules';

-- Add comments to columns
COMMENT ON COLUMN coupons.code IS 'Unique coupon code (e.g., FIRST100, CODERED)';
COMMENT ON COLUMN coupons.discount_type IS 'Type of discount: percentage or fixed amount';
COMMENT ON COLUMN coupons.discount_value IS 'Discount value (percentage number or amount in rupees)';
COMMENT ON COLUMN coupons.usage_type IS 'Usage restriction: first_time_only, one_time_per_user, or unlimited';
COMMENT ON COLUMN coupons.max_uses IS 'Maximum total uses allowed (null = unlimited)';
COMMENT ON COLUMN coupons.current_uses IS 'Current number of times used';
COMMENT ON COLUMN coupons.min_order_amount IS 'Minimum order amount required to use coupon';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_dates ON coupons(start_date, end_date);

-- ==========================================
-- 2. CREATE COUPON USAGE TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS coupon_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id uuid, -- Foreign key to auth.users, but nullable for guest users
  user_email text, -- Store email for guest users
  order_id text NOT NULL,
  discount_applied numeric NOT NULL CHECK (discount_applied >= 0),
  used_at timestamp with time zone DEFAULT now()
);

-- Add comment to table
COMMENT ON TABLE coupon_usage IS 'Tracks coupon usage by users for validation and analytics';

-- Add comments to columns
COMMENT ON COLUMN coupon_usage.user_id IS 'User ID for registered users (null for guests)';
COMMENT ON COLUMN coupon_usage.user_email IS 'Email for guest users or registered users';
COMMENT ON COLUMN coupon_usage.discount_applied IS 'Actual discount amount applied in rupees';

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user ON coupon_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_email ON coupon_usage(user_email);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order ON coupon_usage(order_id);

-- ==========================================
-- 3. CREATE DATABASE FUNCTION (OPTIONAL BUT RECOMMENDED)
-- ==========================================
-- This function atomically increments coupon usage count

CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE coupons 
  SET current_uses = current_uses + 1,
      updated_at = now()
  WHERE id = coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment to function
COMMENT ON FUNCTION increment_coupon_usage IS 'Atomically increments the usage count for a coupon';

-- ==========================================
-- 4. CREATE AUTO-UPDATE TRIGGER (OPTIONAL)
-- ==========================================
-- Automatically updates the updated_at timestamp

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coupons_updated_at 
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 5. SAMPLE DATA (FOR TESTING)
-- ==========================================

-- Insert sample coupons for testing
INSERT INTO coupons (code, discount_type, discount_value, start_date, end_date, usage_type, is_active, min_order_amount)
VALUES 
  ('FIRST100', 'percentage', 10, now(), now() + interval '1 year', 'first_time_only', true, 300),
  ('CODERED', 'fixed', 50, now(), now() + interval '6 months', 'one_time_per_user', true, 500),
  ('SUMMER25', 'percentage', 25, now(), now() + interval '3 months', 'one_time_per_user', true, 800)
ON CONFLICT (code) DO NOTHING;

-- ==========================================
-- 6. ROW LEVEL SECURITY (OPTIONAL - FOR PRODUCTION)
-- ==========================================

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- Allow public to read active coupons (for validation)
CREATE POLICY "Allow public read on coupons" ON coupons
  FOR SELECT
  USING (true);

-- Allow authenticated users to read their usage
CREATE POLICY "Users can view their own usage" ON coupon_usage
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Allow service role to insert usage records (backend only)
CREATE POLICY "Service role can insert usage" ON coupon_usage
  FOR INSERT
  WITH CHECK (true);

-- Admin policies (if you have admin role)
-- CREATE POLICY "Admins can manage coupons" ON coupons
--   FOR ALL
--   USING (auth.jwt() ->> 'role' = 'admin');

-- ==========================================
-- 7. VERIFICATION QUERIES
-- ==========================================

-- Check if tables were created successfully
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('coupons', 'coupon_usage');

-- View sample coupons
SELECT code, discount_type, discount_value, usage_type, is_active, current_uses
FROM coupons
ORDER BY created_at DESC;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('coupons', 'coupon_usage');

-- ==========================================
-- 8. CLEANUP (IF NEEDED)
-- ==========================================

-- To delete all data and start fresh:
-- TRUNCATE TABLE coupon_usage CASCADE;
-- TRUNCATE TABLE coupons CASCADE;

-- To drop tables completely (WARNING: DESTRUCTIVE):
-- DROP TABLE IF EXISTS coupon_usage CASCADE;
-- DROP TABLE IF EXISTS coupons CASCADE;
-- DROP FUNCTION IF EXISTS increment_coupon_usage;
-- DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- ==========================================
-- SETUP COMPLETE!
-- ==========================================
-- Your coupon system is ready to use!
-- Go to Admin Dashboard → Coupon Manager to create coupons
-- ==========================================

