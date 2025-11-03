# 🧪 Leads Testing Guide

## What I Fixed

### ✅ **Problem 1: Payment cancellations not being saved**
**Before:** When you closed Razorpay popup, it didn't save to database  
**After:** Now saves immediately with detailed logging

### ✅ **Problem 2: All payment events now tracked**
- Modal closed (X button)
- Payment failed  
- Payment cancelled
- All now saved to database!

### ✅ **Problem 3: Better debugging**
Added extensive console logging to track everything

---

## 🧪 How to Test

### **Test 1: Abandoned Checkout (Cancel Payment)**

1. **Open Browser Console** (Press F12 → Console tab)
2. Go to your website: `http://localhost:5173`
3. Add a product to cart
4. Go to checkout
5. Fill in all shipping info:
   - Name: Test User
   - Email: test@test.com
   - Phone: 1234567890
   - Address, city, state, etc.
6. Continue to payment page
7. Click **"Pay Now"**
8. When Razorpay popup appears, **close it** (click X or press Escape)

**What to look for in Console:**
```
⚠️ User closed Razorpay modal without completing payment
⚠️ PAYMENT FAILED/CANCELLED: Payment cancelled - modal closed
📋 Preparing failed order data...
Shipping Address: {firstName: "Test", email: "test@test.com", ...}
💾 Saving failed payment to database...
✅ Failed payment saved to database for leads tracking!
📍 Go to Admin → Leads to see this!
```

9. **Go to Admin Panel:**
   - Navigate to: `http://localhost:5173/admindashboard`
   - Click **"Leads"** tab
   - Click **"Refresh"** button
   - Look in Console for:
     ```
     🔍 Fetching orders from database...
     📊 Orders fetched: X orders
     📦 Processing orders...
     Order 1: {order_id: "...", payment_id: null, ...}
     ✅ Added lead: Test User (Checkout (Abandoned))
     ✅ Total leads loaded: X
     ```

10. **You should see:**
    - Orange badge: "Checkout (Abandoned)"
    - Name: Test User
    - Email: test@test.com
    - Cart Value: ₹X

---

### **Test 2: Successful Purchase**

1. Complete a full purchase with test card:
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date

2. Go to Admin → Leads → Refresh

3. **You should see:**
   - Green badge: "Customer (Purchased)"
   - Full customer details
   - Order value

---

### **Test 3: Signup**

1. Go to: `http://localhost:5173/signup`
2. Create a new account:
   - Name: New User
   - Email: newuser@test.com
   - Password: test123

3. Go to Admin → Leads → Refresh

4. **You should see:**
   - Purple badge: "Signup" (if they haven't placed an order)
   - OR green badge: "Customer (Purchased)" (if they placed an order after signup)

---

### **Test 4: Contact Form**

1. Go to Contact page
2. Fill in contact form
3. Submit

4. Go to Admin → Leads → Refresh

5. **You should see:**
   - Blue badge: "Contact Form"
   - Their name, email, phone
   - Their message

---

## 🔍 Debugging Checklist

### If Leads Not Showing:

**Step 1: Check Browser Console (Most Important!)**

Open Console (F12) and look for:

**When cancelling payment:**
- ✅ `⚠️ PAYMENT FAILED/CANCELLED`
- ✅ `💾 Saving failed payment to database...`
- ✅ `✅ Failed payment saved to database`

If you see `❌ Failed to save` → There's a database error

**When viewing Leads:**
- ✅ `🔍 Fetching orders from database...`
- ✅ `📊 Orders fetched: X orders`
- ✅ `✅ Total leads loaded: X`

If orders fetched = 0 → Database is empty or connection issue

---

**Step 2: Verify Database Connection**

In Console, you should see on page load:
```
✅ Supabase configured successfully
```

If you see errors about Supabase → Check `.env` file has correct credentials

---

**Step 3: Check Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Go to **Table Editor** → **orders** table
3. Look for your test orders
4. Check if `payment_id` column exists and has `null` for failed payments

---

**Step 4: Refresh Leads Page**

- Click the **"Refresh"** button in Leads tab
- Check console logs
- See if data loads

---

## 📊 What Console Logs Mean

### ✅ Success Logs:

```
✅ Order saved to Supabase
✅ Failed payment saved to database for leads tracking!
📊 Orders fetched: 6 orders
✅ Total leads loaded: 6
```
**Meaning:** Everything working! Check Leads tab.

### ⚠️ Warning Logs:

```
⚠️ Order order_123 has no shipping address - skipping
```
**Meaning:** That order won't show in Leads (no contact info)

### ❌ Error Logs:

```
❌ Error fetching orders: {...}
```
**Meaning:** Database connection issue or table doesn't exist

```
❌ Failed to save failed payment to database: {...}
```
**Meaning:** Can't write to database - check Supabase permissions

---

## 🎯 Common Issues & Fixes

### Issue 1: "Orders fetched: 0 orders"
**Fix:** Database is empty. Place a test order first!

### Issue 2: "Failed to save failed payment"
**Fix:** 
- Check Supabase credentials in `.env`
- Check `orders` table exists in Supabase
- Verify table permissions (allow inserts)

### Issue 3: "Leads show 0 even though orders exist"
**Fix:**
- Check console: Does it say "has no shipping address"?
- Shipping address is required to show in Leads
- Make sure you filled the checkout form

### Issue 4: Data not updating
**Fix:**
- Click **"Refresh"** button in Leads tab
- Or reload the entire admin page

---

## 🚀 Expected Flow

### Perfect Scenario:

**User Side:**
1. Add to cart → Fill checkout → Cancel payment
2. Console shows: `✅ Failed payment saved`

**Admin Side:**
1. Go to Leads tab
2. Click Refresh
3. Console shows: `✅ Total leads loaded: X`
4. See the lead in the table!

---

## 💡 Pro Tip

**Keep Console Open** while testing:
- You'll see exactly what's happening
- Errors will be obvious
- You'll know if data is being saved

Press **F12** → **Console** tab → Test everything!

---

## 🎉 After Testing

Once you see leads appearing:
- ✅ Click "View" to see full details
- ✅ Try the search function
- ✅ Test filters (All, Customers, Abandoned, etc.)
- ✅ Export if needed

**You have a complete CRM system!** 🚀

