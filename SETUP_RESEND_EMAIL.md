# Setup Email Service (Resend - Fastest & Easiest)

## Why Resend?
- ✅ **Easiest** to set up (5 minutes)
- ✅ **Free tier**: 3,000 emails/month
- ✅ Works great with Supabase
- ✅ Modern, developer-friendly
- ✅ No credit card required
- ✅ Perfect for development & production

---

## 🚀 5-Minute Setup

### Step 1: Create Resend Account
```
1. Go to: https://resend.com
2. Click "Sign Up"
3. Use GitHub login (fastest) or email
4. Verify your email
```

### Step 2: Get API Key
```
1. After login, you'll see Dashboard
2. Click "API Keys" in sidebar
3. Click "Create API Key"
4. Name it: "Supabase Auth"
5. Copy the API key (starts with re_...)
6. Save it somewhere safe!
```

### Step 3: Verify Your Domain (OR Use Resend's Domain)

#### Option A: Use Resend's Domain (Fastest - 0 setup)
```
- Resend gives you: onboarding@resend.dev
- Works immediately
- Good for testing
- Use this for now!
```

#### Option B: Use Your Own Domain (Better - 5 min)
```
1. In Resend Dashboard → Click "Domains"
2. Click "Add Domain"
3. Enter: thepowderlegacy.in
4. You'll get DNS records to add
5. Add these to your domain provider:
   - TXT record for verification
   - CNAME records for sending
6. Wait 5-10 minutes for verification
7. Done! Now emails from noreply@thepowderlegacy.in
```

### Step 4: Configure Supabase

```
1. Go to Supabase Dashboard
2. Project Settings → Authentication
3. Scroll to "SMTP Settings"
4. Enable "Enable Custom SMTP"
5. Enter these details:

   Host: smtp.resend.com
   Port: 465
   Username: resend
   Password: [Your API Key from Step 2]
   
   Sender email: 
     - If using Resend domain: onboarding@resend.dev
     - If using your domain: noreply@thepowderlegacy.in
   
   Sender name: The Powder Legacy
   
6. Click "Save"
```

### Step 5: Test It!
```
1. Go to your website
2. Try "Forgot Password"
3. Check your email (check spam too)
4. Click reset link
5. ✅ Should work!
```

---

## 📧 Alternative: SendGrid (Also Good)

If you prefer SendGrid:

### Setup SendGrid (Free - 100 emails/day)
```
1. Go to: https://sendgrid.com
2. Sign up (free account)
3. Settings → API Keys → Create API Key
4. Name it: "Supabase"
5. Full Access → Create
6. Copy API Key

Supabase SMTP Settings:
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: [Your SendGrid API Key]
   Sender: noreply@yourdomain.com
```

---

## 🔧 Now Implement Password Reset

Let me create the password reset page for you:

