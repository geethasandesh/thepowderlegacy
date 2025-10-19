# Testing Guide - E-Commerce User Flow

## 🧪 How to Test the Implementation

### Test Scenario 1: Guest Checkout Flow
1. **Start Fresh**
   - Clear localStorage: Open DevTools → Application → Local Storage → Clear All
   - Go to homepage without logging in

2. **Browse & Add to Cart**
   - Browse products at `/shop`
   - Add 2-3 products to cart
   - Verify cart count appears in header

3. **View Cart**
   - Click cart icon
   - Verify all items are displayed
   - Try updating quantities
   - Try removing an item

4. **Proceed to Checkout**
   - Click "Proceed to Checkout"
   - You should see the login prompt page at `/checkout`
   - Notice two options: Login/Signup vs Guest Checkout

5. **Guest Checkout**
   - Click "Continue as Guest"
   - Fill in shipping address form
   - Use email: `guest@example.com`
   - Complete the order

6. **Verify Guest Order**
   - Order should be saved in Supabase with `user_id = null`
   - Email should be stored in `shipping_address` field

---

### Test Scenario 2: Registered User Flow
1. **Sign Up**
   - Click "Sign Up" in header
   - Create account with:
     - Name: Test User
     - Email: `test@example.com`
     - Password: `password123`
   - Should redirect to homepage after signup

2. **Add to Favorites**
   - Browse products
   - Click heart icon on 2-3 products
   - Click "Favorites" in header
   - Verify products appear in favorites

3. **Add to Cart & Checkout**
   - Add products to cart
   - Click "Proceed to Checkout"
   - Should skip login prompt (already logged in)
   - Go directly to address form
   - Complete order

4. **View Order History**
   - Click user avatar → "My Orders"
   - Or go to `/orders`
   - Verify order appears with all details

5. **Manage Account**
   - Click user avatar → "My Account"
   - Edit profile information
   - Navigate to Orders, Favorites from sidebar

6. **Logout**
   - Click user avatar → "Logout"
   - Verify redirected to homepage
   - Verify header shows "Login" and "Sign Up" buttons again

---

### Test Scenario 3: Guest to User Migration
1. **Place Guest Order**
   - Clear localStorage
   - Add products to cart as guest
   - Checkout as guest with email: `migrate@example.com`
   - Complete order

2. **Add Guest Favorites**
   - Add 2-3 products to favorites (stored in localStorage)
   - Note the product IDs

3. **Create Account with Same Email**
   - Click "Sign Up"
   - Use the same email: `migrate@example.com`
   - Create account

4. **Verify Migration**
   - Check console for: "✅ Linked X guest orders to user..."
   - Go to "My Orders" - should see the guest order
   - Go to "Favorites" - should see the guest favorites merged
   - Cart should also be preserved

---

### Test Scenario 4: Cart Persistence
1. **As Guest**
   - Add items to cart
   - Close browser tab
   - Reopen site
   - Verify cart items are still there (from localStorage)

2. **As Logged In User**
   - Login to account
   - Add items to cart
   - Close browser
   - Open on different device (same account)
   - Verify cart is synced (from Supabase)

---

### Test Scenario 5: Favorites Sync
1. **Add Favorites as Guest**
   - Add 3 products to favorites
   - Check localStorage → should have `favorites` array

2. **Login**
   - Login to your account
   - Check favorites page
   - Should see guest favorites + any existing favorites

3. **Add More Favorites**
   - Add 2 more products
   - Check Supabase `user_favorites` table
   - Should see all 5 products

4. **Logout & Login Again**
   - Logout
   - Login again
   - Favorites should persist (loaded from Supabase)

---

### Test Scenario 6: Header UI States
1. **Not Logged In**
   - Header should show:
     - Favorites icon
     - Cart icon with count
     - "Login" button
     - "Sign Up" button

2. **Logged In**
   - Header should show:
     - Favorites icon
     - Cart icon with count
     - User avatar with initials
   - Hover over avatar:
     - Should show dropdown with:
       - User name and email
       - My Account
       - My Orders
       - Favorites
       - Logout

---

### Test Scenario 7: Checkout Login Prompt
1. **Access Checkout as Guest**
   - Add items to cart
   - Click "Proceed to Checkout"
   - Should see `/checkout` page with two options

2. **Verify UI**
   - Left card: Login/Signup benefits
   - Right card: Guest checkout option
   - Both options clearly visible
   - No confusion about what to do

3. **Test Navigation**
   - Click "Login" → should go to `/login?redirect=checkout`
   - After login → should redirect to `/checkout/address`
   - Click "Create Account" → should go to `/signup?redirect=checkout`
   - After signup → should redirect to `/checkout/address`
   - Click "Continue as Guest" → should go to `/checkout/address`

---

### Test Scenario 8: Account Page Features
1. **Profile Information**
   - Go to `/account`
   - Should see profile card with:
     - Avatar with initials
     - Name and email
     - Sidebar navigation

2. **Edit Profile**
   - Click "Edit Profile" or "Profile Details"
   - Update name and phone
   - Save changes
   - Verify changes persist after page reload

3. **Navigation**
   - Test sidebar links:
     - Profile Details
     - My Orders → `/orders`
     - Favorites → `/favorites`
     - Shopping Cart → `/cart`

4. **Guest State**
   - Logout
   - Go to `/account`
   - Should see "Login" and "Sign Up" buttons
   - Should see tip about creating account

---

## 🔍 Things to Check

### In Browser DevTools
1. **Console**
   - Check for any errors
   - Look for success messages like "✅ Order saved"
   - Verify auth state changes

2. **Network Tab**
   - Check Supabase API calls
   - Verify authentication tokens
   - Check order creation requests

3. **Application Tab**
   - **localStorage**:
     - `cart_items`: Array of cart items
     - `favorites`: Array of product IDs
     - `profile`: Guest profile object
     - `shippingAddress`: Last used address
   - **Session Storage**: Supabase session data

### In Supabase Dashboard
1. **Authentication**
   - Check Users table for new registrations
   - Verify email is stored correctly

2. **Orders Table**
   - Guest orders: `user_id` = null, email in `shipping_address`
   - User orders: `user_id` populated
   - After migration: guest orders should have `user_id`

3. **User Carts Table**
   - Each user should have one row
   - `items` field should be JSONB array
   - Should update when cart changes

4. **User Favorites Table**
   - One row per favorite per user
   - Should have `user_id` and `product_id`

---

## ✅ Success Criteria

### Must Work
- ✅ Guest can browse and checkout without account
- ✅ Registered users can login and access their data
- ✅ Cart persists across sessions (both guest and user)
- ✅ Favorites sync with user account
- ✅ Orders appear in order history
- ✅ Guest orders link to account when user signs up
- ✅ Header shows correct UI based on auth state
- ✅ Checkout flow is smooth and intuitive

### UI Must Be
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Clear and intuitive navigation
- ✅ No confusing or broken states
- ✅ Professional appearance
- ✅ Fast and performant

### Security Must Include
- ✅ Passwords never stored in localStorage
- ✅ Auth tokens managed by Supabase
- ✅ Row Level Security in Supabase (optional)
- ✅ No sensitive data in console logs

---

## 🐛 Common Issues & Solutions

### Issue: "Supabase not configured" warning
**Solution**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env` file

### Issue: Favorites not syncing
**Solution**: Check Supabase `user_favorites` table exists and has correct schema

### Issue: Orders not showing
**Solution**: 
- Check Supabase `orders` table
- Verify user_id matches or email matches for guest orders

### Issue: Guest cart lost on login
**Solution**: Check CartContext hydration logic in `useEffect`

### Issue: Login redirect not working
**Solution**: Check URL search params for `?redirect=checkout`

---

## 📱 Mobile Testing
1. Open site on mobile device
2. Test all flows (guest, registered, checkout)
3. Verify hamburger menu works
4. Check touch interactions
5. Verify forms are mobile-friendly

---

## 🎯 Performance Testing
1. **Load Time**
   - Homepage should load quickly
   - No large images blocking render

2. **State Updates**
   - Cart updates should be instant
   - No lag when adding favorites

3. **Navigation**
   - Route changes should be smooth
   - No flash of wrong content

---

Happy Testing! 🚀

