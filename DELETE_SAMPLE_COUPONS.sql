-- ==========================================
-- DELETE SAMPLE COUPONS
-- ==========================================
-- Run this in Supabase SQL Editor to remove
-- the 3 sample coupons if you don't want them
-- ==========================================

-- Delete usage records first (if any)
DELETE FROM coupon_usage 
WHERE coupon_id IN (
  SELECT id FROM coupons 
  WHERE code IN ('FIRST100', 'CODERED', 'SUMMER25')
);

-- Delete the sample coupons
DELETE FROM coupons 
WHERE code IN ('FIRST100', 'CODERED', 'SUMMER25');

-- Verify they're gone
SELECT code, discount_value, is_active 
FROM coupons
ORDER BY created_at DESC;

-- ==========================================
-- Result: Sample coupons removed!
-- You can now create your own from scratch
-- ==========================================

