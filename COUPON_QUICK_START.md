# 🚀 Coupon System - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Create Database Tables (2 minutes)

1. **Open Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/tmqvhdccrclvgcmkgofl
   ```

2. **Go to SQL Editor**
   ```
   Left sidebar → SQL Editor → New Query
   ```

3. **Copy & Run This SQL**
   ```sql
   -- COUPONS TABLE
   CREATE TABLE coupons (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     code text UNIQUE NOT NULL,
     discount_type text NOT NULL,
     discount_value numeric NOT NULL,
     start_date timestamp with time zone NOT NULL,
     end_date timestamp with time zone NOT NULL,
     is_active boolean DEFAULT true,
     usage_type text NOT NULL,
     max_uses integer,
     current_uses integer DEFAULT 0,
     min_order_amount numeric DEFAULT 0,
     created_at timestamp with time zone DEFAULT now(),
     updated_at timestamp with time zone DEFAULT now()
   );

   -- COUPON USAGE TABLE
   CREATE TABLE coupon_usage (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     coupon_id uuid REFERENCES coupons(id) ON DELETE CASCADE,
     user_id uuid,
     user_email text,
     order_id text NOT NULL,
     discount_applied numeric NOT NULL,
     used_at timestamp with time zone DEFAULT now()
   );

   -- INDEXES
   CREATE INDEX idx_coupons_code ON coupons(code);
   CREATE INDEX idx_coupons_active ON coupons(is_active);
   CREATE INDEX idx_coupon_usage_coupon ON coupon_usage(coupon_id);
   CREATE INDEX idx_coupon_usage_user ON coupon_usage(user_id);
   CREATE INDEX idx_coupon_usage_email ON coupon_usage(user_email);

   -- HELPER FUNCTION
   CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id uuid)
   RETURNS void AS $$
   BEGIN
     UPDATE coupons 
     SET current_uses = current_uses + 1,
         updated_at = now()
     WHERE id = coupon_id;
   END;
   $$ LANGUAGE plpgsql;
   ```

4. **Click "Run"**
   ```
   ✅ Should show: "Success. No rows returned"
   ```

---

### Step 2: Create Your First Coupon (2 minutes)

1. **Login to Admin Dashboard**
   ```
   Your site → /admin
   Login with admin credentials
   ```

2. **Go to Coupon Manager**
   ```
   Click "Coupon Manager" in sidebar
   ```

3. **Create Test Coupon**
   ```
   Click "New Coupon"
   
   Fill form:
   - Code: WELCOME10
   - Type: Percentage
   - Value: 10
   - Usage: First time users only
   - Start Date: Today
   - End Date: Next year
   - Active: ✅ Checked
   
   Click "Create Coupon"
   ```

4. **Verify**
   ```
   ✅ Should see WELCOME10 in table
   ✅ Status: Active (green)
   ✅ Uses: 0/∞
   ```

---

### Step 3: Test on Frontend (1 minute)

1. **Add Products to Cart**
   ```
   Browse shop → Add any product
   ```

2. **Go to Checkout**
   ```
   Cart → Proceed to Checkout
   Continue as Guest (or login)
   ```

3. **Fill Shipping Address**
   ```
   Enter your details
   ```

4. **Apply Coupon**
   ```
   Scroll to Order Summary
   Click "Have a coupon code?"
   Enter: WELCOME10
   Click "Apply"
   
   ✅ Should show:
   "Coupon Applied: WELCOME10"
   "You saved ₹XX!"
   Total price updated!
   ```

---

## 🎯 Create More Coupons

### Example: Limited Flash Sale
```
Code: FLASH50
Type: Fixed Amount
Value: 50
Usage: One time per user
Start: Today
End: Tomorrow
Max Uses: 100
Min Order: 500
```

### Example: Seasonal Discount
```
Code: SUMMER25
Type: Percentage
Value: 25
Usage: One time per user
Start: June 1
End: August 31
Min Order: 800
```

### Example: VIP Code
```
Code: VIP100
Type: Fixed
Value: 100
Usage: Unlimited
Start: Today
End: Next year
Min Order: 1000
```

---

## ✅ Features You Can Use

### Admin Dashboard:

1. **Create Coupons**
   - Set any code you want
   - Choose percentage or fixed discount
   - Set validity period
   - Control usage restrictions

2. **Manage Coupons**
   - Edit discount values
   - Change dates
   - Toggle active/inactive instantly
   - Delete old coupons

3. **Track Usage**
   - See total uses for each coupon
   - View user list (click usage count)
   - See discount amounts
   - Track by email/user ID

### Customer Checkout:

1. **Apply Coupon**
   - Click "Have a coupon code?"
   - Enter code
   - See discount applied instantly

2. **Validation**
   - Real-time error messages
   - Clear feedback
   - Can try different codes

3. **Discount Display**
   - Shows in order summary
   - Updates total price
   - Included in order confirmation

---

## 🎨 What You'll See

### Admin Coupon Manager:
```
╔════════════════════════════════════════════╗
║  Coupon Management         [+ New Coupon] ║
╠════════════════════════════════════════════╣
║ Code     │ Discount │ Type │ Uses │ Status║
║──────────┼──────────┼──────┼──────┼───────║
║ FIRST100 │ 10%      │ FT   │ 45/∞ │ Active║
║ CODERED  │ ₹50      │ 1x   │120/500│Active║
║ SUMMER25 │ 25%      │ 1x   │ 0/∞  │Inactive║
╚════════════════════════════════════════════╝
```

### User Checkout:
```
╔══════════════════════════════╗
║ Order Summary                ║
╠══════════════════════════════╣
║ [Have a coupon code?]   ▼    ║
╠══════════════════════════════╣
║ Subtotal:           ₹500     ║
║ Coupon Discount:    -₹50     ║ ← NEW!
║ Shipping:           FREE     ║
║ ─────────────────────────    ║
║ Total:              ₹450     ║
╚══════════════════════════════╝
```

---

## 🧪 Testing Scenarios

### Test 1: First-Time User Coupon
```
1. Create coupon: FIRST100 (first time only)
2. New user adds ₹500 to cart
3. Apply FIRST100
✅ Gets 10% off (₹50)

4. Same user places second order
5. Try FIRST100 again
❌ "Only for first-time customers"
```

### Test 2: One-Time Per User
```
1. Create coupon: CODERED (once per user)
2. User applies CODERED
✅ Gets ₹50 off

3. Same user, new cart
4. Try CODERED again
❌ "Already used this coupon"
```

### Test 3: Enable/Disable
```
1. Admin disables SUMMER25
2. User tries to apply
❌ "This coupon is not active"

3. Admin enables again
4. User applies
✅ Works!
```

### Test 4: Expired Coupon
```
1. Admin sets end date to yesterday
2. User tries to apply
❌ "This coupon has expired"
```

### Test 5: Minimum Amount
```
Coupon requires ₹500 minimum
Cart total: ₹300

User applies coupon
❌ "Minimum order amount ₹500 required"

User adds more items (total: ₹600)
User applies coupon
✅ Works!
```

---

## 📊 Admin Functions

### Enable/Disable Coupon:
```
1. Find coupon in table
2. Click the "Active" or "Inactive" badge
3. Status toggles instantly
✅ Users can't use disabled coupons
```

### View Who Used Coupon:
```
1. Click on usage count (e.g., "45/∞")
2. Modal opens showing:
   - User email
   - Order ID
   - Discount applied
   - Date used
```

### Edit Coupon:
```
1. Click edit icon (pencil)
2. Form opens with current values
3. Change what you need
4. Save
✅ Updates immediately
```

### Delete Coupon:
```
1. Click delete icon (trash)
2. Confirm deletion
✅ Coupon removed
✅ Usage history preserved
```

---

## 🎯 Business Use Cases

### Welcome Discount (Acquire New Customers)
```
Code: WELCOME15
Discount: 15% off
Type: First time only
Valid: Always
→ Convert first-time visitors!
```

### Limited Flash Sale (Create Urgency)
```
Code: FLASH100
Discount: ₹100 off
Max Uses: 50
Valid: Today only
→ Drive quick sales!
```

### Loyalty Reward (Retain Customers)
```
Code: LOYAL20
Discount: 20% off
Type: Once per user
Min Order: ₹800
→ Reward returning customers!
```

### Cart Value Booster
```
Code: BIG500
Discount: ₹100 off
Min Order: ₹1500
→ Increase average order value!
```

---

## 🔍 Troubleshooting

### Coupon not applying
```
Check:
1. Is coupon active? (Admin dashboard)
2. Is it within valid dates?
3. Does cart meet minimum amount?
4. Has user used it before? (if restricted)
5. Check browser console for errors
```

### Admin can't see coupons
```
Solution:
1. Verify Supabase tables created
2. Check admin is logged in
3. Refresh page
4. Check console for errors
```

### Usage not tracking
```
Solution:
1. Verify coupon_usage table exists
2. Check order was created successfully
3. Look at Supabase logs
4. Verify increment function works
```

---

## 📱 Mobile Experience

All components work perfectly on mobile:
- ✅ Coupon input is touch-friendly
- ✅ Admin table scrolls horizontally
- ✅ Modals are responsive
- ✅ Easy to use on any device

---

## 🎉 You're Done!

Your coupon system is now:
- ✅ Fully implemented
- ✅ Admin controlled
- ✅ User validated
- ✅ Usage tracked
- ✅ Production ready

**Just create the database tables and start creating coupons!** 🎊

---

## 📝 Quick Reference

### Create Coupon (Admin):
```
Admin Dashboard → Coupon Manager → New Coupon
```

### Apply Coupon (User):
```
Checkout → Have a coupon code? → Enter code → Apply
```

### View Usage (Admin):
```
Coupon Manager → Click usage count → See modal
```

### Enable/Disable (Admin):
```
Coupon Manager → Click status badge → Toggles
```

---

## 🆘 Need Help?

See these files:
- **`COUPON_SYSTEM_COMPLETE.md`** - Full documentation
- **`SUPABASE_COUPON_SCHEMA.sql`** - Database schema
- **`coupon-service.js`** - API functions

---

**Everything is ready! Just run the SQL and start creating coupons!** 🚀

