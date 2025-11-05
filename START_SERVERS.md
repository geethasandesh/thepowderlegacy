# 🚀 How to Start Both Servers

## ⚠️ **IMPORTANT: You Need 2 Servers Running!**

Your app needs TWO servers to work:
1. **Frontend** (Vite) - Port 5173
2. **Backend** (Express) - Port 3001

---

## 📋 **How to Start Everything:**

### **Option 1: Two Terminal Windows** (Recommended)

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Runs on: `http://localhost:5173`

**Terminal 2 - Backend:**
```bash
node server/index.js
```
Runs on: `http://localhost:3001`

**Keep BOTH running!**

---

### **Option 2: Single Terminal** (Alternative)

Add this to your `package.json` scripts:
```json
"scripts": {
  "dev": "vite",
  "server": "node server/index.js",
  "start:all": "concurrently \"npm run dev\" \"npm run server\""
}
```

Then install concurrently:
```bash
npm install --save-dev concurrently
```

Then run:
```bash
npm run start:all
```

---

## ✅ **Check if Backend is Running:**

Open browser: `http://localhost:3001/api/health`

Should show:
```json
{"status":"ok","message":"Server is running"}
```

If you see this = Backend is running ✅

---

## 🎯 **Current Status:**

I just started the backend server for you!

**Check your terminal - you should see:**
```
🚀 API Server running on http://localhost:3001
📧 Email endpoint: http://localhost:3001/api/send-order-email

📧 Email Configuration:
   SMTP_USER: your_email@gmail.com
   GMAIL_USER: your_email@gmail.com
   etc...
```

---

## 🧪 **Test Email System Now:**

**With BOTH servers running:**

1. Go to: `http://localhost:5173/admindashboard`
2. Click **"Leads"** tab
3. Click **"Refresh"**
4. Click **"View"** on "Sandeshddd gee"
5. Click **"Send Cart Recovery Email"**
6. Should work! ✅

---

## 🐛 **Troubleshooting:**

### **Error: "404 Not Found"**
**Problem:** Backend server not running  
**Fix:** Start backend: `node server/index.js`

### **Error: "ECONNREFUSED"**
**Problem:** Backend server crashed or not started  
**Fix:** Check backend terminal for errors, restart it

### **Error: "Email credentials not set"**
**Problem:** `.env` file missing Gmail credentials  
**Fix:** Add to `.env`:
```env
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

---

## ⚡ **Quick Commands:**

```bash
# Start frontend (Terminal 1)
npm run dev

# Start backend (Terminal 2)
node server/index.js

# Check backend health
curl http://localhost:3001/api/health
```

---

## ✅ **You're Ready!**

With both servers running:
- ✅ Website works (port 5173)
- ✅ Admin panel works
- ✅ Email sending works
- ✅ Everything works!

**Test the email system now!** 🎉

