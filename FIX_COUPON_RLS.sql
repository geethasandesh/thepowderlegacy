-- ==========================================
-- FIX COUPON RLS (Row Level Security) ERROR
-- ==========================================
-- Run this in Supabase SQL Editor
-- ==========================================

-- QUICK FIX: Disable RLS (For Development)
-- ==========================================
-- This allows all operations without restrictions
-- Good for development, you can add proper policies later

ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- VERIFY IT'S DISABLED
-- ==========================================

SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('coupons', 'coupon_usage');

-- Should show rowsecurity = false

-- ==========================================
-- ALTERNATIVE: Enable RLS with Policies
-- ==========================================
-- If you want to keep RLS enabled but allow admin access,
-- uncomment and run these instead:

-- Re-enable RLS
-- ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- Allow all operations on coupons (for authenticated users)
-- CREATE POLICY "Allow all operations on coupons" ON coupons
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

-- Allow all operations on coupon_usage
-- CREATE POLICY "Allow all operations on coupon_usage" ON coupon_usage
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

-- ==========================================
-- DONE! Try creating a coupon again
-- ==========================================

