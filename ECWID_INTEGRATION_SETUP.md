# 🎯 Ecwid Integration Setup Guide

## Overview

Your website now automatically syncs **all orders** (successful and failed) to your Ecwid account! This means you can manage everything through Ecwid's admin panel:

- ✅ Track all orders in one place
- ✅ See failed payment attempts
- ✅ Manage order fulfillment
- ✅ Update order status
- ✅ Add tracking numbers
- ✅ Handle refunds/returns
- ✅ Export orders
- ✅ Generate reports

---

## 📋 What Was Integrated

### 1. **Successful Orders** → Ecwid
When a customer completes payment:
- Order is saved to **Supabase** (your database)
- Order is pushed to **Ecwid** with status `PAID`
- Email sent to customer and admin
- Invoice generated

### 2. **Failed Payments** → Ecwid
When a payment fails or is cancelled:
- Failed attempt is recorded in **Ecwid** with status `INCOMPLETE`
- Notes include failure reason
- You can see which customers had payment issues
- Follow up with customers if needed

### 3. **All Payment Methods**
Works for:
- Direct Razorpay checkout
- Payment links
- All payment methods

---

## 🔧 Setup Instructions

### Step 1: Get Your Ecwid Store ID

1. Log in to your **Ecwid Control Panel**
2. Go to **Settings** → **General** → **Store Profile**
3. Your **Store ID** is displayed at the top (it's a number like `12345678`)
4. Copy this number

### Step 2: Get Your Ecwid Secret Token

1. In Ecwid Control Panel, go to **Apps** → **API**
   - Direct link: https://my.ecwid.com/cp/#apps:api
2. Look for **"Secret Token"** or **"Private Token"** section
3. Click **"Create new token"** if you don't have one
4. Select these permissions:
   - ✅ **Create orders** (required)
   - ✅ **Update orders** (recommended)
   - ✅ **Read orders** (recommended)
5. Copy the generated token (looks like: `secret_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456`)

> ⚠️ **IMPORTANT**: Keep this token secret! Never share it publicly.

### Step 3: Add Credentials to Your .env File

1. Open your `.env` file (or create one from `EXAMPLE.env`)
2. Add these two lines:

```env
VITE_ECWID_STORE_ID=12345678
VITE_ECWID_SECRET_TOKEN=secret_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456
```

3. Replace with your actual Store ID and Secret Token
4. Save the file

### Step 4: Restart Your Development Server

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test It!

1. Place a test order on your website
2. Complete the payment
3. Go to your **Ecwid Control Panel** → **Orders**
4. You should see the order there! 🎉

---

## 📊 What You'll See in Ecwid

### Successful Orders:
- **Status**: `PAID`
- **Payment Method**: Razorpay
- **Payment Reference**: Razorpay Payment ID
- **Customer Details**: Name, email, phone, address
- **Order Items**: All products with sizes and quantities
- **Pricing**: Subtotal, delivery, coupons, total
- **Notes**: Source website, order ID, user ID, coupon codes

### Failed Orders:
- **Status**: `INCOMPLETE`
- **Notes**: Contains error message and timestamp
- **All customer details**: So you can follow up
- **Cart contents**: What they tried to buy

---

## 🎛️ Managing Orders in Ecwid

### Track Orders
1. Go to **Ecwid Control Panel** → **Orders**
2. View all orders (successful + failed)
3. Filter by status, date, customer, etc.
4. Search by order number or customer name

### Update Order Status
1. Click on any order
2. Change status:
   - `Processing` → Order is being prepared
   - `Shipped` → Order has been shipped
   - `Delivered` → Order delivered
   - `Cancelled` → Order cancelled
   - `Refunded` → Refund issued

### Add Tracking Information
1. Open an order
2. Click **"Add tracking number"**
3. Enter tracking number and courier name
4. Ecwid can auto-email customers with tracking info!

### Generate Reports
1. Go to **Reports** section
2. Export orders to CSV/Excel
3. View sales analytics
4. Track revenue over time

---

## 🔍 How It Works (Technical)

### Order Flow:
```
Customer Checkout
    ↓
Payment Success
    ↓
Save to Supabase ✅
    ↓
Push to Ecwid API ✅ (your new integration!)
    ↓
Send Email ✅
    ↓
Generate Invoice ✅
```

### Failed Payment Flow:
```
Customer Checkout
    ↓
Payment Fails ❌
    ↓
Record in Ecwid (status: INCOMPLETE) ✅
    ↓
Send Failed Payment Email ✅
```

### Files Modified:
- `src/services/ecwid-integration.js` - New Ecwid service
- `src/components/pages/CheckoutPayment.jsx` - Added Ecwid sync
- `src/components/pages/PaymentCallback.jsx` - Added Ecwid sync
- `EXAMPLE.env` - Added Ecwid credentials template

---

## 🐛 Troubleshooting

### Orders not showing in Ecwid?

**Check 1: Are credentials configured?**
```bash
# Check your .env file has:
VITE_ECWID_STORE_ID=your_store_id
VITE_ECWID_SECRET_TOKEN=your_secret_token
```

**Check 2: Is server restarted?**
- After adding credentials, restart your dev server

**Check 3: Check browser console**
- Open browser DevTools (F12)
- Look for messages like:
  - ✅ `Order synced to Ecwid successfully`
  - ⚠️ `Failed to sync order to Ecwid` (with error details)

**Check 4: Verify API token permissions**
- Go to Ecwid → Apps → API
- Make sure token has "Create orders" permission

### Error: "Missing Ecwid credentials"

This is just a warning. The integration will skip Ecwid sync but the order will still:
- ✅ Be saved to Supabase
- ✅ Send emails
- ✅ Generate invoices

To fix: Add credentials to `.env` file and restart server.

### Error: "Ecwid API returned 401"

Your secret token is invalid or expired. Generate a new one:
1. Go to Ecwid → Apps → API
2. Revoke old token
3. Create new token with proper permissions
4. Update `.env` file

### Error: "Ecwid API returned 400"

Check browser console for details. Usually means:
- Invalid data format
- Required field missing
- Contact support with error details

---

## 🚀 Advanced Features

### Custom Order Status Updates

You can programmatically update order status from your website:

```javascript
import { updateEcwidOrder } from './services/ecwid-integration'

// Update order status
await updateEcwidOrder(ecwidOrderId, {
  fulfillmentStatus: 'SHIPPED',
  trackingNumber: 'TRACK123456',
  shippingTrackingUrl: 'https://tracking-url.com/TRACK123456'
})
```

### Check if Order Already Exists

```javascript
import { getEcwidOrderByExternalId } from './services/ecwid-integration'

// Check if order exists in Ecwid
const result = await getEcwidOrderByExternalId('order_123456')
if (result.success) {
  console.log('Order exists:', result.order)
}
```

---

## 📞 Support

### Need Help?
- Check Ecwid API docs: https://api-docs.ecwid.com/
- Check browser console for error messages
- Verify credentials in `.env` file
- Ensure API token has correct permissions

### Common Questions

**Q: Will old orders be synced to Ecwid?**
A: No, only new orders (placed after setup) will sync automatically. You can manually import old orders if needed.

**Q: Can I disable Ecwid sync?**
A: Yes! Just remove or comment out the `VITE_ECWID_STORE_ID` from your `.env` file. Orders will still work, just won't sync to Ecwid.

**Q: Does this affect my existing order process?**
A: No! It's a non-blocking addition. Even if Ecwid sync fails, orders are still saved to Supabase, emails are sent, and invoices are generated.

**Q: Can I use Ecwid checkout instead?**
A: This integration uses your custom checkout but syncs to Ecwid for management. If you want to use Ecwid's checkout entirely, that's a different setup.

**Q: Will this cost extra?**
A: Check your Ecwid plan. Most plans include API access. API calls are free within reasonable limits.

---

## ✅ Next Steps

1. ✅ Get Ecwid credentials (Store ID + Secret Token)
2. ✅ Add to `.env` file
3. ✅ Restart server
4. ✅ Test with a real order
5. ✅ Check Ecwid dashboard
6. ✅ Configure email notifications in Ecwid (optional)
7. ✅ Set up shipping rules in Ecwid (optional)

---

## 🎉 You're All Set!

Your website now has enterprise-level order management! Every order automatically syncs to Ecwid where you can:
- Track everything
- Manage fulfillment
- Handle returns
- Export data
- Generate reports
- And much more!

Enjoy your fully integrated e-commerce system! 🚀

