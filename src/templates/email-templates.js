/**
 * Email Templates for Customer Communication
 * All templates are dynamic and personalized with customer data
 */

// Logo URL - hosted on the website
const LOGO_URL = 'https://thepowderlegacy.in/logo.png'

/**
 * Abandoned Cart Recovery Email
 * Sent when customer leaves items in cart without completing payment
 */
export function abandonedCartTemplate(leadData) {
  const { name, email, items = [], cartValue = 0 } = leadData
  
  const itemsList = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <span style="color: #666; font-size: 14px;">Size: ${item.size} • Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${item.price * item.quantity}
      </td>
    </tr>
  `).join('')

  return {
    subject: `${name}, you left ${items.length} items in your cart! 🛒`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #2d5f3f; padding: 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="The Powder Legacy Logo" style="width: 120px; height: auto; margin-bottom: 15px;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">The Powder Legacy</h1>
              <p style="margin: 10px 0 0 0; color: #e0e0e0; font-size: 14px;">100% Hand-Made Traditional Products</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Hi ${name},</h2>
              
              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                We noticed you left some items in your cart. Don't worry, we've saved them for you!
              </p>

              <p style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.6;">
                <strong>Your cart (${items.length} items):</strong>
              </p>

              <!-- Cart Items -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px; border: 1px solid #eee; border-radius: 4px;">
                ${itemsList}
                <tr>
                  <td style="padding: 16px; background-color: #f9f9f9; font-weight: bold; font-size: 18px;">
                    Total
                  </td>
                  <td style="padding: 16px; background-color: #f9f9f9; text-align: right; font-weight: bold; font-size: 18px; color: #2d5f3f;">
                    ₹${cartValue}
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                <strong>Was there an issue with payment?</strong><br>
                We're here to help! You can:
              </p>

              <ul style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.8;">
                <li>Call us: <strong>+91-7337334653</strong></li>
                <li>Email us: <strong>contact@thepowderlegacy.in</strong></li>
                <li>Or simply complete your order below</li>
              </ul>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://thepowderlegacy.in/cart" style="display: inline-block; background-color: #2d5f3f; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      Complete Your Order
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; color: #999; font-size: 14px; line-height: 1.6; text-align: center;">
                Need assistance? We're always happy to help!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                The Powder Legacy • Plot No. 542, Dr. Prakashrao Nagar, Ghatkesar – 500088, Telangana, India
              </p>
              <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} The Powder Legacy. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }
}

/**
 * Payment Issue Follow-up Email
 * Sent to understand why payment failed
 */
export function paymentIssueTemplate(leadData) {
  const { name, email, cartValue = 0 } = leadData

  return {
    subject: `${name}, we noticed a payment issue - Can we help? 💚`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #2d5f3f; padding: 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="The Powder Legacy Logo" style="width: 120px; height: auto; margin-bottom: 15px;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">The Powder Legacy</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Hi ${name},</h2>
              
              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                We noticed you tried to place an order for <strong>₹${cartValue}</strong> but the payment couldn't be completed.
              </p>

              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 0 0 30px 0;">
                <p style="margin: 0; color: #856404; font-size: 16px; line-height: 1.6;">
                  <strong>We're here to help!</strong><br>
                  Is there something we can assist you with?
                </p>
              </div>

              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                <strong>Common issues we can help with:</strong>
              </p>

              <ul style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.8;">
                <li>Payment gateway issues</li>
                <li>Card decline problems</li>
                <li>Questions about products</li>
                <li>Shipping concerns</li>
                <li>Any other questions</li>
              </ul>

              <p style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.6;">
                <strong>We'd love to help you complete your order!</strong>
              </p>

              <!-- Contact Options -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px; background-color: #f9f9f9; border-radius: 6px;">
                    <p style="margin: 0 0 15px 0; color: #333; font-size: 18px; font-weight: bold;">📞 Contact Us</p>
                    <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                      <strong>Call:</strong> +91-7337334653
                    </p>
                    <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                      <strong>Email:</strong> contact@thepowderlegacy.in
                    </p>
                    <p style="margin: 0; color: #666; font-size: 14px;">
                      <strong>Hours:</strong> Mon-Sat, 9 AM - 6 PM
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://thepowderlegacy.in/cart" style="display: inline-block; background-color: #2d5f3f; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      Try Again
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; color: #999; font-size: 14px; line-height: 1.6; text-align: center;">
                We're committed to making your shopping experience smooth and enjoyable!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                The Powder Legacy • contact@thepowderlegacy.in
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }
}

/**
 * Welcome Email for New Customers
 * Sent when someone completes their first purchase
 */
export function welcomeCustomerTemplate(leadData) {
  const { name } = leadData

  return {
    subject: `Welcome to The Powder Legacy family, ${name}! 🌿`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #2d5f3f; padding: 40px 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="The Powder Legacy Logo" style="width: 140px; height: auto; margin-bottom: 20px;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">Welcome! 🌿</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Thank You, ${name}!</h2>
              
              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                Thank you for choosing The Powder Legacy! We're thrilled to have you as part of our natural skincare family.
              </p>

              <div style="background-color: #e8f5e9; padding: 20px; border-radius: 6px; margin: 0 0 30px 0;">
                <p style="margin: 0; color: #2d5f3f; font-size: 16px; line-height: 1.6;">
                  🌿 <strong>100% Natural</strong> • Hand-made with love<br>
                  ✨ <strong>Chemical-Free</strong> • Safe for all ages<br>
                  🇮🇳 <strong>Made in India</strong> • Supporting local artisans
                </p>
              </div>

              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                <strong>Care Tips for Your Products:</strong>
              </p>

              <ul style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.8;">
                <li>Store in a cool, dry place</li>
                <li>Keep away from direct sunlight</li>
                <li>Use within 6 months for best results</li>
                <li>Patch test before first use</li>
              </ul>

              <p style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.6;">
                We'd love to hear your feedback! Feel free to reach out anytime.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://thepowderlegacy.in/shop" style="display: inline-block; background-color: #2d5f3f; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      Continue Shopping
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                📧 contact@thepowderlegacy.in • 📞 +91-7337334653
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} The Powder Legacy. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }
}

/**
 * Follow-up Email for Registered Users Who Haven't Purchased
 * Sent to encourage first purchase
 */
export function firstPurchaseFollowUpTemplate(leadData) {
  const { name, items = [], cartValue = 0 } = leadData

  const hasCart = items.length > 0

  return {
    subject: `${name}, your cart is waiting! Complete your first order 🎁`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #2d5f3f; padding: 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="The Powder Legacy Logo" style="width: 120px; height: auto; margin-bottom: 15px;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Still Thinking? 💭</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Hi ${name},</h2>
              
              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                We noticed you created an account${hasCart ? ' and added items to your cart' : ''} but haven't completed your first order yet.
              </p>

              ${hasCart ? `
              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                <strong>Your cart value: ₹${cartValue}</strong><br>
                ${items.length} natural products waiting for you!
              </p>
              ` : ''}

              <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 0 0 30px 0;">
                <p style="margin: 0; color: #1565c0; font-size: 16px; line-height: 1.6;">
                  💡 <strong>Need help choosing?</strong><br>
                  Our team is here to recommend the perfect products for your needs!
                </p>
              </div>

              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                <strong>Why customers love us:</strong>
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px; background-color: #f9f9f9; border-radius: 6px; margin-bottom: 10px;">
                    <p style="margin: 0; color: #333; font-size: 14px;">
                      ⭐⭐⭐⭐⭐ <strong>4.8/5.0</strong> from 500+ happy customers
                    </p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #f9f9f9; border-radius: 6px;">
                    <p style="margin: 0; color: #333; font-size: 14px;">
                      🚚 <strong>Free shipping</strong> on orders above ₹500
                    </p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #f9f9f9; border-radius: 6px;">
                    <p style="margin: 0; color: #333; font-size: 14px;">
                      🌿 <strong>100% natural</strong> ingredients, no chemicals
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.6; text-align: center;">
                <strong>Questions? Call us: +91-7337334653</strong>
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://thepowderlegacy.in/${hasCart ? 'cart' : 'shop'}" style="display: inline-block; background-color: #2d5f3f; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      ${hasCart ? 'Complete Your Order' : 'Start Shopping'}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} The Powder Legacy. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }
}

/**
 * Contact Form Response Template
 * Reply to contact form inquiries
 */
export function contactResponseTemplate(leadData) {
  const { name, message, subject } = leadData

  return {
    subject: `Re: ${subject || 'Your Inquiry'} - The Powder Legacy`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #2d5f3f; padding: 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="The Powder Legacy Logo" style="width: 120px; height: auto; margin-bottom: 15px;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Thank You for Contacting Us!</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Hi ${name},</h2>
              
              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                Thank you for reaching out to us! We've received your message and will get back to you shortly.
              </p>

              ${message ? `
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 0 0 30px 0;">
                <p style="margin: 0 0 10px 0; color: #999; font-size: 12px; text-transform: uppercase;">Your Message:</p>
                <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; font-style: italic;">
                  "${message}"
                </p>
              </div>
              ` : ''}

              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                Our team will review your inquiry and respond within <strong>24 hours</strong>.
              </p>

              <p style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.6;">
                In the meantime, feel free to:
              </p>

              <ul style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.8;">
                <li>Browse our <a href="https://thepowderlegacy.in/shop" style="color: #2d5f3f;">product catalog</a></li>
                <li>Read our <a href="https://thepowderlegacy.in/about" style="color: #2d5f3f;">brand story</a></li>
                <li>Follow us on <a href="https://www.instagram.com/thepowderlegacy" style="color: #2d5f3f;">Instagram</a></li>
              </ul>

              <!-- Contact Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px; background-color: #f9f9f9; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #333; font-size: 16px; font-weight: bold;">Need Immediate Assistance?</p>
                    <p style="margin: 0; color: #666; font-size: 14px;">
                      📞 Call: +91-7337334653 (Mon-Sat, 9 AM - 6 PM)
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #999; font-size: 14px; text-align: center;">
                We look forward to serving you!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                The Powder Legacy • contact@thepowderlegacy.in
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }
}

/**
 * Signup Welcome Email - sent when user creates an account
 * Based on the exact format requested by client
 */
export function signupWelcomeTemplate(userData) {
  const { name, email } = userData
  const resetPasswordUrl = userData.resetPasswordUrl || 'https://thepowderlegacy.in/reset-password'
  const accountUrl = 'https://thepowderlegacy.in/account'
  const facebookUrl = 'https://www.facebook.com/thepowderlegacy'
  const instagramUrl = 'https://www.instagram.com/thepowderlegacy'

  return {
    subject: 'Welcome to The Powder Legacy! Your Journey to Natural Wellness Begins Here 🌿',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- TPL Logo Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2d5f3f 0%, #1e4a2f 100%); padding: 40px 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="The Powder Legacy Logo" style="width: 150px; height: auto; margin-bottom: 20px;" />
              <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 32px; font-weight: bold;">The Powder Legacy</h1>
              <p style="margin: 0; color: #e0e0e0; font-size: 14px; letter-spacing: 1px;">100% NATURAL • HAND-MADE • TRADITIONAL</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 26px; font-weight: 600;">Hi ${name},</h2>
              
              <p style="margin: 0 0 20px 0; color: #555; font-size: 16px; line-height: 1.6;">
                A very warm welcome to <strong>The Powder Legacy</strong> family! We're so thrilled you've decided to join our community dedicated to authentic, herbal wellness.
              </p>

              <p style="margin: 0 0 30px 0; color: #555; font-size: 16px; line-height: 1.6;">
                Your account has been successfully created, giving you access to a simpler and faster shopping experience.
              </p>

              <!-- Account Details Box -->
              <div style="background-color: #f9fdf9; border: 2px solid #2d5f3f; border-radius: 8px; padding: 25px; margin: 0 0 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #2d5f3f; font-size: 18px; font-weight: 600;">Your Account Details:</h3>
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #666; font-size: 15px; padding: 8px 0;"><strong>Username:</strong></td>
                    <td style="color: #333; font-size: 15px; padding: 8px 0;">${name}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-size: 15px; padding: 8px 0;"><strong>Email:</strong></td>
                    <td style="color: #333; font-size: 15px; padding: 8px 0;">${email}</td>
                  </tr>
                </table>
              </div>

              <!-- Password Setup (if confirmation required) -->
              ${resetPasswordUrl && resetPasswordUrl !== 'https://thepowderlegacy.in/reset-password' ? `
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 0 0 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 15px 0; color: #856404; font-size: 15px; line-height: 1.6;">
                  <strong>⚠️ Action Required:</strong> To activate your account and set your password, please click the button below.
                </p>
                <p style="margin: 0; color: #856404; font-size: 13px;">
                  (This link is secure and will expire in 24 hours for your security.)
                </p>
              </div>

              <!-- Set Password Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="${resetPasswordUrl}" style="display: inline-block; background-color: #2d5f3f; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      Set Your Password
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- What You Can Do Now -->
              <h3 style="margin: 30px 0 20px 0; color: #2d5f3f; font-size: 20px; font-weight: 600;">✨ What You Can Do Now:</h3>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #eee;">
                    <p style="margin: 0; color: #555; font-size: 15px; line-height: 1.6;">
                      <strong style="color: #2d5f3f;">📊 Access Your Account Dashboard:</strong><br>
                      <a href="${accountUrl}" style="color: #2d5f3f; text-decoration: underline;">[My Account]</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #eee;">
                    <p style="margin: 0; color: #555; font-size: 15px; line-height: 1.6;">
                      <strong style="color: #2d5f3f;">📦 Track Your Orders:</strong><br>
                      Track your orders and view your history
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #eee;">
                    <p style="margin: 0; color: #555; font-size: 15px; line-height: 1.6;">
                      <strong style="color: #2d5f3f;">❤️ Save Favorites:</strong><br>
                      Save your favorite products to a wishlist
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0;">
                    <p style="margin: 0; color: #555; font-size: 15px; line-height: 1.6;">
                      <strong style="color: #2d5f3f;">📍 Manage Addresses:</strong><br>
                      Manage your shipping addresses for faster checkout
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Social Media -->
              <div style="background-color: #f0f8f4; padding: 25px; border-radius: 8px; margin: 0 0 30px 0; text-align: center;">
                <p style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: 600;">
                  🌿 Follow Our Journey
                </p>
                <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
                  Connect with us for daily wellness tips and community stories
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding: 5px;">
                      <a href="${facebookUrl}" style="display: inline-block; background-color: #1877f2; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin: 5px;">
                        📘 Facebook
                      </a>
                      <a href="${instagramUrl}" style="display: inline-block; background-color: #E4405F; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin: 5px;">
                        📷 Instagram
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 0 0 20px 0; color: #555; font-size: 16px; line-height: 1.6;">
                Thank you for trusting us with your wellness ritual. We can't wait to be a part of your journey to a more natural you.
              </p>

              <p style="margin: 0 0 30px 0; color: #555; font-size: 16px; line-height: 1.6; font-style: italic;">
                <strong>With gratitude,</strong><br>
                The Team at The Powder Legacy<br>
                <a href="https://www.thepowderlegacy.com" style="color: #2d5f3f;">www.thepowderlegacy.com</a>
              </p>

              <!-- P.S. Contact Section -->
              <div style="background-color: #fff9e6; border-left: 4px solid #2d5f3f; padding: 20px; border-radius: 4px;">
                <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.6;">
                  <strong>P.S.</strong> Have a question or need help choosing the right product for you? Simply reply to this email or WhatsApp us on <strong style="color: #2d5f3f;">+91 – 7093 121 689</strong> —we love helping our community find their perfect match!
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 25px 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                📧 contact@thepowderlegacy.in • 📞 +91-7093 121 689
              </p>
              <p style="margin: 0 0 10px 0; color: #999; font-size: 12px;">
                Plot No. 542, Dr. Prakashrao Nagar, Ghatkesar – 500088, Telangana, India
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} The Powder Legacy. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }
}

/**
 * Generic Template for Custom Messages
 */
export function customEmailTemplate(name, customMessage, customSubject = 'Message from The Powder Legacy') {
  return {
    subject: customSubject,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #2d5f3f; padding: 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="The Powder Legacy Logo" style="width: 120px; height: auto; margin-bottom: 15px;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">The Powder Legacy</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Hi ${name},</h2>
              
              <div style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.6;">
                ${customMessage}
              </div>

              <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                If you have any questions, feel free to reach out!
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 20px; background-color: #f9f9f9; border-radius: 6px; text-align: center;">
                    <p style="margin: 0; color: #666; font-size: 14px;">
                      📞 +91-7337334653 • 📧 contact@thepowderlegacy.in
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} The Powder Legacy. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }
}

