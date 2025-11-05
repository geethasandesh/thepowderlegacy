# 🚀 Ecwid Integration - Quick Start

## What This Does

**Your website now automatically sends ALL orders to Ecwid!**

✅ Successful orders → Tracked in Ecwid  
✅ Failed payments → Recorded in Ecwid  
✅ All customer data → Available in Ecwid dashboard  
✅ Order management → Through Ecwid admin panel

---

## ⚡ 3-Minute Setup

### 1. Get Ecwid Store ID
- Login to Ecwid → Settings → General
- Copy your **Store ID** (number like `12345678`)

### 2. Get Ecwid Secret Token  
- Ecwid → Apps → API → Create Token
- Enable: **Create orders**, **Update orders**, **Read orders**
- Copy the token (starts with `secret_`)

### 3. Add to .env File
```env
VITE_ECWID_STORE_ID=12345678
VITE_ECWID_SECRET_TOKEN=secret_abc123xyz
```

### 4. Restart Server
```bash
npm run dev
```

### 5. Test!
- Place a test order
- Check Ecwid Control Panel → Orders
- Should appear there! 🎉

---

## 🎯 What You Get

### In Ecwid Dashboard:
- 📦 All orders in one place
- 💳 Payment details (Razorpay IDs)
- 📧 Customer contact info
- 📍 Shipping addresses
- 🛒 Cart contents with sizes/quantities
- ⚠️ Failed payment attempts (with error reasons)
- 📊 Sales reports and analytics
- 📤 Export to CSV/Excel
- 🚚 Add tracking numbers
- ✉️ Auto-email customers with updates

---

## 🔧 Managing Orders

### Track Order Status:
Ecwid → Orders → Click any order → Update status:
- `Processing` - Preparing order
- `Shipped` - Add tracking number
- `Delivered` - Mark as complete
- `Cancelled` / `Refunded` - As needed

### Add Tracking:
Open order → "Add tracking number" → Customer gets auto-email ✉️

### View Analytics:
Reports tab → Sales over time, top products, revenue, etc.

---

## 🐛 Not Working?

**Check browser console (F12):**
- Look for `✅ Order synced to Ecwid successfully`
- Or `⚠️ Failed to sync order to Ecwid` with error

**Common Fixes:**
- Verify credentials in `.env` file
- Restart dev server after adding credentials
- Check token has "Create orders" permission in Ecwid
- Make sure Store ID and Token are correct

---

## 📚 Full Documentation

See `ECWID_INTEGRATION_SETUP.md` for:
- Detailed setup guide
- Technical details
- Advanced features
- Troubleshooting
- API usage examples

---

## 💡 Pro Tips

1. **Enable Ecwid email notifications** to auto-notify customers about shipping
2. **Set up Ecwid shipping rules** for automatic rate calculation
3. **Use Ecwid mobile app** to manage orders on the go
4. **Export orders regularly** for accounting/bookkeeping
5. **Check "Incomplete" orders** in Ecwid to see failed payments and follow up

---

## ✅ That's It!

You're now running a fully integrated e-commerce system with professional order management! 🎉

Questions? Check `ECWID_INTEGRATION_SETUP.md` for detailed docs.

