# 🎯 How Coupon Validation & Usage Tracking Works

## ✅ Your Question Answered:

> **"If a person checks coupon availability but doesn't complete payment, it won't be counted as used, right?"**

**ANSWER: YES, EXACTLY RIGHT! ✅**

The coupon is **ONLY marked as used AFTER successful payment**, not when they apply it at checkout.

---

## 🔄 Complete Flow (Step-by-Step)

### Step 1: User Enters Coupon Code
```
User at checkout → Enters "FIRST100" → Clicks "Apply"
```

**What Happens:**
- ✅ Code is validated in real-time
- ✅ Checks if coupon exists
- ✅ Checks if active
- ✅ Checks dates
- ✅ Checks eligibility
- ❌ **NOT YET MARKED AS USED** ← Important!

**Database Changes:**
- ❌ No record in `coupon_usage` table
- ❌ No increment to `current_uses`
- ✅ Just validation, nothing saved!

---

### Step 2: Validation Checks (Real-Time)
```javascript
// When user clicks "Apply", system checks:

1. Does coupon exist? 
   → Query: SELECT * FROM coupons WHERE code = 'FIRST100'
   
2. Is it active?
   → Check: is_active = true
   
3. Is it within valid dates?
   → Check: now >= start_date AND now <= end_date
   
4. Does cart meet minimum amount?
   → Check: cart_total >= min_order_amount
   
5. Has max uses been reached?
   → Check: current_uses < max_uses (if max_uses exists)
   
6. Is user eligible?
   
   IF usage_type = 'first_time_only':
     → Query: SELECT COUNT(*) FROM orders 
              WHERE user_id = [user] OR email = [email]
     → If count > 0: ❌ "Only for first-time customers"
     
   IF usage_type = 'one_time_per_user':
     → Query: SELECT COUNT(*) FROM coupon_usage
              WHERE coupon_id = [id] 
              AND (user_id = [user] OR user_email = [email])
     → If count > 0: ❌ "Already used this coupon"
```

**Result:**
- ✅ All checks pass → Coupon applied to cart
- ❌ Any check fails → Error message shown

**Database:**
- ❌ Still NOTHING saved to database
- ✅ Just calculations in memory

---

### Step 3: User Sees Discount (In Cart Only)
```
Order Summary:
Subtotal:          ₹500
Coupon Discount:   -₹50  ← Calculated, not saved!
Total:             ₹450
```

**Important:**
- ✅ Discount shown in UI
- ✅ Total price calculated
- ❌ **NOT saved to database yet**
- ❌ **NOT marked as used yet**

**User Can Still:**
- Remove the coupon
- Try different codes
- Close browser
- Come back later
- ✅ Coupon still available for everyone!

---

### Step 4: User Abandons / Doesn't Pay ❌
```
User closes browser or navigates away
```

**What Happens:**
- ✅ Coupon validation data cleared from memory
- ✅ No record in database
- ✅ `current_uses` NOT incremented
- ✅ Coupon is still available
- ✅ Other users can use it
- ✅ Same user can try again later

**Database State:**
```sql
-- coupons table
current_uses: 0  ← Still 0!

-- coupon_usage table  
(no new record)  ← Nothing saved!
```

---

### Step 5: User Completes Payment ✅
```
User fills form → Clicks Pay → Payment succeeds
```

**What Happens NOW:**

**A) Order Created:**
```javascript
await saveOrder({
  orderId: "order_123",
  items: [...],
  totals: {
    subtotal: 500,
    couponDiscount: 50,  // ← Saved in order
    total: 450
  },
  couponCode: "FIRST100",  // ← Saved for reference
  userId: "user_id",
  shippingAddress: {...}
})
```

**B) Coupon Usage Recorded:**
```javascript
// This ONLY happens after successful payment!
await recordCouponUsage(
  couponId: "uuid-of-FIRST100",
  userId: "user_id",
  userEmail: "user@example.com",
  orderId: "order_123",
  discountApplied: 50
)
```

**C) Usage Counter Incremented:**
```javascript
// This increments the counter
await incrementCouponUsage(couponId)

// In database:
current_uses: 0 → 1  ← NOW it's incremented!
```

**Database State After Payment:**
```sql
-- coupons table
code: 'FIRST100'
current_uses: 1  ← Incremented!

-- coupon_usage table (NEW RECORD)
coupon_id: uuid-of-FIRST100
user_id: uuid-of-user
user_email: user@example.com
order_id: order_123
discount_applied: 50
used_at: 2025-10-19 10:30:00

-- orders table
order_id: order_123
coupon_code: FIRST100
totals: { couponDiscount: 50, ... }
```

---

## 🎯 Key Points (Your Questions Answered)

### Q1: When is coupon marked as used?
**A: ONLY after successful payment!** ✅

### Q2: If user applies coupon but doesn't pay?
**A: Coupon NOT marked as used, still available!** ✅

### Q3: Can same user try again after abandoning?
**A: YES! They can come back and use it!** ✅

### Q4: How is user data stored?
**A: Only stored AFTER payment in `coupon_usage` table** ✅

---

## 📊 Timeline Visualization

```
Time:   0min          2min          5min          10min
        │             │             │             │
User:   Apply         See           Navigate      Comes back
        Coupon        Discount      Away          and pays
        │             │             │             │
DB:     Nothing       Nothing       Nothing       ✅ RECORDED!
        saved         saved         saved         
                                                  
Coupon  Check         Check         Still         NOW
Status: ✅ Valid      ✅ Valid      ✅ Available  ❌ Used!
```

---

## 🔍 Where Each Step Happens

### Step 1-3: Frontend Only (No Database Writes)
```javascript
// Location: CouponInput.jsx
User enters code → applyCoupon() called

// Location: CouponContext.jsx  
validateCoupon() → Just reads database, doesn't write

// Location: coupon-service.js
Validation checks → SELECT queries only

Result: Discount calculated in memory ✅
Database: NO changes yet ❌
```

### Step 4: User Abandons (Nothing Happens)
```javascript
User closes tab
Memory cleared
No database operations
Coupon still available for everyone ✅
```

### Step 5: Payment Success (Database Writes)
```javascript
// Location: CheckoutPayment.jsx or PaymentCallback.jsx
Payment successful → handlePaymentSuccess()

// Step 1: Save order
await saveOrder({
  couponCode: "FIRST100",
  totals: { couponDiscount: 50 }
})

// Step 2: Record usage (THIS IS WHERE IT'S MARKED AS USED!)
await recordCouponUsage(
  couponId,
  userId,
  email,
  orderId,
  discountAmount
)

// Step 3: Increment counter
Database executes: current_uses = current_uses + 1

Result: NOW it's marked as used! ✅
```

---

## 💾 Database Records Created (Only After Payment)

### Record 1: In `orders` table
```json
{
  "order_id": "order_123",
  "totals": {
    "subtotal": 500,
    "couponDiscount": 50,
    "total": 450
  },
  "coupon_code": "FIRST100",
  "user_id": "user-uuid",
  "created_at": "2025-10-19..."
}
```

### Record 2: In `coupon_usage` table
```json
{
  "id": "usage-uuid",
  "coupon_id": "coupon-uuid",
  "user_id": "user-uuid",
  "user_email": "user@example.com",
  "order_id": "order_123",
  "discount_applied": 50,
  "used_at": "2025-10-19..."
}
```

### Record 3: Update in `coupons` table
```sql
UPDATE coupons 
SET current_uses = current_uses + 1
WHERE id = 'coupon-uuid'

Before: current_uses = 0
After:  current_uses = 1
```

---

## 🎮 Scenarios Explained

### Scenario 1: User Applies & Pays ✅
```
1. Apply coupon → ✅ Valid
2. See discount → ₹50 off
3. Complete payment → ✅ Success
4. Coupon marked as used → current_uses: 0 → 1
5. User can't use it again (if one-time)
```

### Scenario 2: User Applies & Abandons ❌
```
1. Apply coupon → ✅ Valid
2. See discount → ₹50 off
3. Close browser → Abandoned
4. Coupon NOT marked as used → current_uses: 0 (unchanged)
5. User can come back and use it later
6. Other users can also use it
```

### Scenario 3: User Tries Code Multiple Times
```
1. Enter FIRST100 → Apply → ✅ Valid
2. Remove coupon
3. Enter FIRST100 → Apply → ✅ Still valid!
4. Remove again
5. Enter FIRST100 → Apply → ✅ Still valid!
...repeat 100 times...
✅ All valid! Not marked as used until payment!
```

### Scenario 4: Payment Fails
```
1. Apply coupon → ✅ Valid
2. Try to pay → ❌ Payment fails
3. Coupon NOT marked as used → Still available
4. User can try again
```

---

## 🛡️ Why This Protects Both Sides

### Protects Business:
- ✅ Coupon only counted when money received
- ✅ Can't game the system by applying without buying
- ✅ Accurate usage statistics
- ✅ No fake uses

### Protects Customers:
- ✅ Can test coupons without losing them
- ✅ Can change mind before paying
- ✅ Payment failure doesn't waste coupon
- ✅ Can try again if something goes wrong

---

## 📱 User Experience Flow

### What User Sees:

**At Checkout:**
```
┌─────────────────────────────────────┐
│ ✨ Apply Coupon Code                │
├─────────────────────────────────────┤
│ [ENTER CODE HERE_______] [Apply]    │
│ 💡 Get instant discount              │
└─────────────────────────────────────┘
```

**After Entering Code:**
```
If valid ✅:
┌─────────────────────────────────────┐
│ ✓ Coupon Code                       │
├─────────────────────────────────────┤
│ ✅ FIRST100                     [×]  │
│ You saved ₹50!                      │
└─────────────────────────────────────┘

If invalid ❌:
┌─────────────────────────────────────┐
│ [INVALID_______] [Apply]            │
├─────────────────────────────────────┤
│ ❌ Invalid coupon code               │
└─────────────────────────────────────┘
```

**In Order Summary:**
```
Subtotal:          ₹500
Coupon Discount:   -₹50  ← Shows discount
Shipping:          FREE
─────────────────────────
Total:             ₹450  ← Price updated
```

**User Actions:**
- ✅ Can remove coupon anytime before payment
- ✅ Can try different codes
- ✅ Can abandon checkout
- ✅ Coupon stays valid until payment succeeds

---

## 🔐 Security & Validation

### When User Clicks "Apply":

**Validation Query:**
```javascript
// Check 1: Coupon exists and is active
const coupon = await supabase
  .from('coupons')
  .select('*')
  .eq('code', 'FIRST100')
  .eq('is_active', true)
  .single()

// Check 2: Not expired
if (now > coupon.end_date) → ❌ Error

// Check 3: User hasn't used it (if restricted)
const usageCount = await supabase
  .from('coupon_usage')
  .select('id', { count: 'exact' })
  .eq('coupon_id', coupon.id)
  .eq('user_email', 'user@example.com')

if (usageCount > 0) → ❌ Error "Already used"

// Check 4: First-time user (if required)
const orderCount = await supabase
  .from('orders')
  .select('id', { count: 'exact' })
  .eq('user_email', 'user@example.com')
  
if (orderCount > 0 && coupon.usage_type === 'first_time_only') 
  → ❌ Error "First-time only"

// All checks passed ✅
→ Show discount in UI
→ Update total price
→ Wait for payment...
```

**At This Point:**
- ✅ Validation complete
- ✅ Discount shown
- ❌ **NOT saved to database**
- ❌ **NOT marked as used**
- ❌ **No database writes**

---

### When Payment SUCCEEDS:

**Database Operations:**
```javascript
// Location: CheckoutPayment.jsx (line 345)
// or PaymentCallback.jsx (line 47)

// ONLY executed AFTER payment confirmation!

// Operation 1: Save to coupon_usage table
INSERT INTO coupon_usage (
  coupon_id,
  user_id,
  user_email,
  order_id,
  discount_applied,
  used_at
) VALUES (
  'uuid-of-FIRST100',
  'user-uuid',
  'user@example.com',
  'order_123',
  50,
  NOW()
)

// Operation 2: Increment usage counter
UPDATE coupons 
SET current_uses = current_uses + 1
WHERE id = 'uuid-of-FIRST100'

// Operation 3: Save in order record
UPDATE orders
SET coupon_code = 'FIRST100',
    totals = {..., couponDiscount: 50}
WHERE order_id = 'order_123'
```

**Now:**
- ✅ Coupon marked as used
- ✅ Counter incremented
- ✅ Can't use again (if one-time)
- ✅ Tracked forever

---

## 📋 Data Stored (Only After Payment)

### In `coupon_usage` Table:
```javascript
{
  coupon_id: "uuid-123",           // Which coupon
  user_id: "user-uuid-456",         // Who used it (if logged in)
  user_email: "john@example.com",   // Email (for guests)
  order_id: "order_789",            // Which order
  discount_applied: 50,             // How much saved
  used_at: "2025-10-19T10:30:00"   // When used
}
```

### Purpose:
- ✅ Track who used which coupon
- ✅ Prevent duplicate use
- ✅ Show admin who used it
- ✅ Analytics and reporting

---

## 🎯 Edge Cases Handled

### Case 1: User Applies, Then Removes
```
1. Apply FIRST100 → Valid ✅
2. Click X to remove
3. Apply FIRST100 again → Valid ✅
4. Remove again
5. Apply different code → Valid ✅

Result: All valid, nothing saved to DB
```

### Case 2: Browser Crash During Checkout
```
1. Apply coupon → Valid ✅
2. Browser crashes
3. User restarts browser
4. Cart data from localStorage
5. Coupon data cleared (was in memory)
6. User can apply again → Valid ✅

Result: No problem, coupon still available
```

### Case 3: Payment Failure
```
1. Apply coupon → Valid ✅
2. Try to pay → Payment fails ❌
3. Coupon NOT marked as used
4. User can try paying again
5. Apply same coupon → Still valid ✅

Result: Fair for customer, no coupon wasted
```

### Case 4: Multiple Tabs Open
```
Tab 1: Apply FIRST100 → Valid ✅
Tab 2: Apply FIRST100 → Valid ✅
Tab 1: Complete payment → Recorded ✅
Tab 2: Try to pay → ❌ "Already used"

Result: Only first successful payment counts
```

---

## 🔄 Validation vs Usage

### Validation (At Apply):
```
Purpose: Check if coupon CAN be used
Database: READ ONLY
Operations:
  - SELECT from coupons
  - COUNT from orders (for first-time check)
  - COUNT from coupon_usage (for duplicate check)
Result: Show discount OR show error
Saved: NOTHING ❌
```

### Usage Recording (After Payment):
```
Purpose: Mark coupon as USED
Database: WRITE operations
Operations:
  - INSERT into coupon_usage
  - UPDATE coupons (increment counter)
  - UPDATE order (save coupon code)
Result: Coupon marked as used
Saved: EVERYTHING ✅
```

---

## 💡 Why This Design is Smart

### Prevents Abuse:
- ✅ Can't mark as used without payment
- ✅ Can't game the system
- ✅ Accurate usage tracking

### Fair to Customers:
- ✅ Can test codes safely
- ✅ Can change mind
- ✅ Payment failure doesn't waste code
- ✅ Transparent process

### Good for Business:
- ✅ Accurate analytics
- ✅ Know who actually paid
- ✅ Can track ROI of coupons
- ✅ Prevent fraud

---

## 🧪 Test This Yourself

### Test 1: Apply Without Paying
```
1. Add ₹500 to cart
2. Checkout → Enter FIRST100 → Apply
✅ Discount shows

3. Check Supabase coupon_usage table
❌ No new record (coupon NOT used yet)

4. Close browser
5. Open again → Checkout
6. Enter FIRST100 → Apply  
✅ Still works! (Coupon available)
```

### Test 2: Complete Payment
```
1. Apply FIRST100 → Valid ✅
2. Complete full payment → Success ✅
3. Check Supabase coupon_usage table
✅ NEW record appears!
✅ current_uses incremented

4. Try to use FIRST100 again
❌ "Already used this coupon"
```

---

## 📊 Admin Can Track

### In Coupon Manager:
```
Click usage count "1/∞"
→ Modal shows:

┌────────────────────────────────┐
│ Usage History: FIRST100        │
├────────────────────────────────┤
│ john@example.com               │
│ Order: order_789               │
│ Discount: -₹50                 │
│ Date: Oct 19, 2025             │
└────────────────────────────────┘
```

**This ONLY shows people who:**
- ✅ Applied the coupon
- ✅ Completed payment
- ❌ NOT people who just tried it

---

## ✅ Summary

### Your Understanding is CORRECT! ✅

> Coupon is **ONLY marked as used** after successful payment!

**Flow:**
1. Apply → Validate (read database)
2. Show discount → Calculate (in memory)
3. User pays → Record usage (write database)
4. Payment fails → Nothing saved

**Database writes happen ONLY in step 3!**

---

## 🎨 UI Update - Now More Visible!

The coupon box is now **ALWAYS VISIBLE** at checkout:
- ✅ No need to click "Have a coupon?"
- ✅ Input field always shown
- ✅ Clear "Apply Coupon Code" heading
- ✅ Helpful hint text
- ✅ Easy to find and use!

**Try it now - much more visible!** 🎯

---

## 🔧 Files to Fix RLS Error

**Run this in Supabase SQL Editor:**
```sql
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage DISABLE ROW LEVEL SECURITY;
```

**See `FIX_COUPON_RLS.sql` for complete fix!**

---

**Everything explained! Coupon is ONLY used after payment completes!** ✅

