# Welcome Email Feature - Documentation

## Overview

When a user signs up for an account on The Powder Legacy website, they automatically receive a professionally designed welcome email with:

- **TPL Logo and Branding** - Beautiful header with gradient background
- **Personalized Welcome Message** - Addresses the user by name
- **Account Details** - Shows username and email
- **What You Can Do Now** - Lists account features (dashboard, track orders, wishlist, addresses)
- **Social Media Links** - Facebook and Instagram buttons
- **Contact Information** - WhatsApp number (+91-7093 121 689) and email

## Implementation

### Files Modified

1. **`src/templates/email-templates.js`**
   - Added new `signupWelcomeTemplate()` function
   - Matches the exact format requested by the client

2. **`api/send-lead-email.js`**
   - Added support for `'signup-welcome'` email type
   - Integrated with existing email infrastructure

3. **`src/contexts/AuthContext.jsx`**
   - Modified `signup()` function to send welcome email
   - Implemented as fire-and-forget to not block signup process

4. **`scripts/test-welcome-email.js`**
   - Created test script to verify email functionality

## How It Works

```javascript
// User signs up
User fills signup form → signup() function called

// Account created in Supabase
Supabase creates user account

// Link guest orders (if any)
System links any previous guest orders to new account

// Send welcome email (non-blocking)
fetch('/api/send-lead-email', {
  emailType: 'signup-welcome',
  leadData: {
    name: displayName,
    email: email
  }
})

// User redirected
User proceeds to dashboard or checkout
```

## Testing

### Prerequisites
- API server must be running: `npm run server`
- SMTP credentials configured in `.env` file

### Test the Email

1. **Using the test script:**
```bash
node scripts/test-welcome-email.js
```

2. **Manual test - Create a real account:**
   - Go to `/signup` on your website
   - Fill in the signup form
   - Submit the form
   - Check the email inbox

3. **Check browser console:**
   - Should see: `📧 Sending welcome email to: user@example.com`
   - Should see: `✅ Welcome email sent successfully`

### Expected Email Content

**Subject:** Welcome to The Powder Legacy! Your Journey to Natural Wellness Begins Here 🌿

**Includes:**
- ✅ TPL logo with gradient header
- ✅ Personalized greeting with user's name
- ✅ Welcome message about joining the community
- ✅ Account details box (username & email)
- ✅ "What You Can Do Now" section with:
  - Access Account Dashboard link
  - Track Your Orders
  - Save Favorites to wishlist
  - Manage shipping addresses
- ✅ Social media section with Facebook & Instagram buttons
- ✅ Thank you message from The Team
- ✅ P.S. section with WhatsApp contact: +91-7093 121 689
- ✅ Footer with contact info and address

## Configuration

### Email Settings (`.env`)

```env
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=admin_email@example.com
```

### Social Media Links

Update in `src/templates/email-templates.js` (lines 561-562):

```javascript
const facebookUrl = 'https://www.facebook.com/thepowderlegacy'
const instagramUrl = 'https://www.instagram.com/thepowderlegacy'
```

### WhatsApp Number

Update in `src/templates/email-templates.js` (line 711):

```javascript
+91 – 7093 121 689
```

## Troubleshooting

### Email not sending

1. **Check API server is running:**
   ```bash
   npm run server
   ```

2. **Check browser console for errors:**
   - Should see signup email logs
   - Look for any error messages

3. **Verify SMTP credentials:**
   - Make sure `.env` has correct Gmail credentials
   - Gmail requires App Password (not regular password)

4. **Check API logs:**
   - Server console should show email API calls
   - Look for error messages

### Email sent but not received

1. **Check spam folder**
2. **Verify email address is correct**
3. **Check Gmail App Password is valid**
4. **Test with `scripts/test-welcome-email.js`**

## Email Template Customization

To modify the email content, edit `src/templates/email-templates.js`:

```javascript
export function signupWelcomeTemplate(userData) {
  const { name, email } = userData
  
  return {
    subject: 'Your custom subject...',
    html: `
      <!-- Your custom HTML here -->
    `
  }
}
```

## Integration with Supabase Email Confirmation

If you enable Supabase email confirmation:

- User receives **Supabase confirmation email** (to verify email)
- User also receives **Welcome email** (from your custom system)

The welcome email will include a password reset link if email confirmation is required.

## API Endpoint Details

**Endpoint:** `POST /api/send-lead-email`

**Payload:**
```json
{
  "emailType": "signup-welcome",
  "leadData": {
    "name": "John Doe",
    "email": "john@example.com",
    "resetPasswordUrl": "https://example.com/reset" // optional
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "...",
  "recipient": "john@example.com",
  "emailType": "signup-welcome"
}
```

## Future Enhancements

Potential improvements:

1. **Welcome email delay** - Send after 5 minutes instead of immediately
2. **Email verification reminder** - If user hasn't verified after 24 hours
3. **First purchase incentive** - Include discount code in welcome email
4. **A/B testing** - Test different welcome email variations
5. **Email analytics** - Track open rates and click rates

## Support

For issues or questions, contact the development team or refer to:
- Email system: `api/send-lead-email.js`
- Email templates: `src/templates/email-templates.js`
- Auth context: `src/contexts/AuthContext.jsx`

