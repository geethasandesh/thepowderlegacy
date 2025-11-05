import nodemailer from 'nodemailer'
import puppeteer from 'puppeteer'

async function generateActualPDFFromHtml(html) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '0.3in',
        right: '0.3in',
        bottom: '0.3in',
        left: '0.3in'
      },
      printBackground: true
    })
    
    await browser.close()
    return pdfBuffer
  } catch (error) {
    console.error('PDF generation failed:', error)
    // Fallback to HTML
    return Buffer.from(html, 'utf8')
  }
}

async function generateActualPDF(data) {
  const html = generateInvoicePDF(data)
  
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      printBackground: true
    })
    
    await browser.close()
    return pdfBuffer
  } catch (error) {
    console.error('PDF generation failed:', error)
    // Fallback to HTML
    return Buffer.from(html, 'utf8')
  }
}

function generateInvoicePDF(data) {
  const itemsRows = (data.orderItems || [])
    .map((i) => `<tr><td>${i.title}</td><td>${i.quantity}</td><td>₹${i.price}</td><td>₹${i.price * i.quantity}</td></tr>`)
    .join('')
  
  const addressLines = (data.customerAddress || '').split('\n').map((l) => l.trim()).filter(Boolean)
  const formattedAddress = addressLines.length > 0 ? addressLines.join('<br/>') : 'No address provided'
  
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page { margin: 0.3in; size: A4; }
        body { font-family: Arial, sans-serif; font-size: 10px; line-height: 1.3; margin: 0; padding: 0; color: #333; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #8B7355; padding-bottom: 10px; }
        .logo { width: 60px; height: 60px; }
        .company-info { text-align: right; }
        .company-name { font-size: 16px; font-weight: bold; color: #8B7355; margin: 0; }
        .company-tagline { font-size: 8px; color: #666; margin: 0; }
        .invoice-title { font-size: 20px; font-weight: bold; color: #8B7355; text-align: center; margin: 15px 0; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
        .detail-section h3 { font-size: 12px; color: #8B7355; margin: 0 0 8px 0; border-bottom: 1px solid #8B7355; padding-bottom: 3px; }
        .detail-row { display: flex; justify-content: space-between; margin: 3px 0; font-size: 9px; }
        .detail-label { font-weight: bold; }
        .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 9px; }
        .items-table th { background: #8B7355; color: white; padding: 8px; text-align: left; font-weight: bold; }
        .items-table td { padding: 6px; border: 1px solid #ddd; }
        .items-table tr:nth-child(even) { background: #f9f9f9; }
        .totals { margin-top: 15px; }
        .total-row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 10px; }
        .total-row.final { border-top: 2px solid #8B7355; padding-top: 8px; font-weight: bold; font-size: 12px; color: #8B7355; }
        .footer { margin-top: 20px; text-align: center; font-size: 8px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" alt="Logo" class="logo">
        <div class="company-info">
            <h1 class="company-name">THE POWDER LEGACY</h1>
            <p class="company-tagline">100% HAND-MADE • Traditional Self-Care Products</p>
        </div>
    </div>
    
    <div class="invoice-title">INVOICE</div>
    
    <div class="details-grid">
        <div class="detail-section">
            <h3>Invoice Details</h3>
            <div class="detail-row"><span class="detail-label">Invoice No:</span><span>${data.orderId}</span></div>
            <div class="detail-row"><span class="detail-label">Payment ID:</span><span>${data.paymentId || 'N/A'}</span></div>
            <div class="detail-row"><span class="detail-label">Date:</span><span>${data.date}</span></div>
            <div class="detail-row"><span class="detail-label">Payment Method:</span><span>Razorpay</span></div>
        </div>
        
        <div class="detail-section">
            <h3>Customer Details</h3>
            <div class="detail-row"><span class="detail-label">Name:</span><span>${data.customerName || 'N/A'}</span></div>
            <div class="detail-row"><span class="detail-label">Email:</span><span>${data.customerEmail || 'N/A'}</span></div>
            <div class="detail-row"><span class="detail-label">Phone:</span><span>${data.customerPhone || 'N/A'}</span></div>
            <div class="detail-row"><span class="detail-label">Address:</span><span>${formattedAddress}</span></div>
        </div>
    </div>
    
    <table class="items-table">
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${itemsRows}
        </tbody>
    </table>
    
    <div class="totals">
        <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${data.subtotal || 0}</span>
        </div>
        <div class="total-row">
            <span>Delivery Charges:</span>
            <span>₹${data.delivery || 0}</span>
        </div>
        <div class="total-row final">
            <span>Grand Total:</span>
            <span>₹${data.orderTotal}</span>
        </div>
    </div>
    
    <div class="footer">
        <p>Thank you for choosing The Powder Legacy!</p>
        <p>For any queries, contact us at: support@powderlegacy.com</p>
    </div>
</body>
</html>`
}

function createTransporter() {
  // Support both SMTP_USER/SMTP_PASS and GMAIL_USER/GMAIL_APP_PASSWORD
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || 'moksh.dev0411@gmail.com'
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || 'aogz maqj cevm yhnk'
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

function renderCustomerEmail(data) {
  const itemsHtml = (data.orderItems || [])
    .map((i) => `<li><strong>${i.title}</strong> × ${i.quantity} — ₹${i.price} (₹${i.price * i.quantity})</li>`) 
    .join('')
  const addressHtml = (data.customerAddress || '')
    .split('\n').map((l) => l.trim()).filter(Boolean).join('<br/>')
  return `<!doctype html><html><head><meta charset="utf-8"/><title>Order Confirmation</title></head>
  <body style="font-family:Arial,sans-serif;background:#f9f9f9;padding:20px;color:#333;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,.08);overflow:hidden;">
      <div style="padding:24px;border-bottom:1px solid #eee;text-align:center;">
        <h1 style="margin:0;font-size:22px;color:#2c3e50;">✅ Your Order with The Powder Legacy is Confirmed</h1>
      </div>
      <div style="padding:24px;line-height:1.6;">
        <p>Hi ${data.customerName || 'Customer'},</p>
        <p>Thank you for shopping with The Powder Legacy! 🎉 Your payment was successful.</p>
        <div style="background:#f8f9fa;padding:16px;border-radius:8px;margin:18px 0;">
          <div><strong>📦 Order Details</strong></div>
          <ul style="margin:8px 0 0 20px;">${itemsHtml}</ul>
          <p><span>Total Amount:</span> <strong>₹${data.orderTotal}</strong></p>
          <p><span>Payment Method:</span> <strong>${data.paymentMethod || 'Razorpay'}</strong></p>
        </div>
        ${addressHtml ? `<div style="background:#f8f9fa;padding:16px;border-radius:8px;">
          <div><strong>🏠 Delivery Address</strong></div>
          <div>${addressHtml}</div>
        </div>` : ''}
        <p>Your invoice has been downloaded automatically. You can reply to this email for any help.</p>
        <p>Warm regards,<br/>The Powder Legacy</p>
      </div>
    </div>
  </body></html>`
}

function renderAdminEmail(data) {
  const itemsRows = (data.orderItems || [])
    .map((i) => `<tr><td>${i.title}</td><td>${i.quantity}</td><td>₹${i.price}</td><td>₹${i.price * i.quantity}</td></tr>`) 
    .join('')
  
  // Format the complete shipping address for admin
  const addressLines = (data.customerAddress || '').split('\n').map((l) => l.trim()).filter(Boolean)
  const formattedAddress = addressLines.length > 0 ? addressLines.join('<br/>') : 'No address provided'
  
  return `<!doctype html><html><head><meta charset="utf-8"/><title>Order</title>
    <style>
      body{font-family:Arial,sans-serif;padding:2px;color:#333;margin:0;font-size:8px;line-height:1.1;}
      .urgent{background:#fee2e2;color:#dc2626;padding:1px;text-align:center;font-weight:bold;margin:1px 0;font-size:7px;}
      .info{font-size:7px;margin:1px 0;}
      .shipping{background:#fef3c7;padding:2px;margin:1px 0;font-size:6px;}
      table{width:100%;border-collapse:collapse;margin:1px 0;font-size:6px;}
      th,td{border:1px solid #d1d5db;padding:1px;text-align:left;}
      th{background:#f3f4f6;color:#15803d;font-weight:bold;}
      .total{font-size:7px;font-weight:bold;color:#15803d;text-align:right;margin-top:1px;}
    </style>
  </head><body>
    <div class="urgent">⚡ SHIP ORDER ${data.orderId || 'N/A'} - ₹${data.orderTotal || 0}</div>
    
    <div class="info">
      <strong>Order:</strong> ${data.orderId || 'N/A'} | 
      <strong>Payment:</strong> ${data.paymentId || 'N/A'} | 
      <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
    </div>
    
    <div class="shipping">
      <strong>SHIP TO:</strong> ${data.customerName || 'N/A'} | ${data.customerEmail || 'N/A'} | ${data.customerPhone || 'N/A'}<br/>
      ${formattedAddress}
    </div>
    
    <table>
      <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
      <tbody>${itemsRows}</tbody>
    </table>
    <div class="total">Total: ₹${data.orderTotal || 0}</div>
  </body></html>`
}

export default async function handler(req, res) {
  console.log('📧 ===== EMAIL API CALLED =====')
  console.log('📧 Request method:', req.method)
  console.log('📧 Request body:', JSON.stringify(req.body, null, 2))
  
  try {
    if (req.method !== 'POST') {
      console.log('❌ Invalid method:', req.method)
      return res.status(405).json({ error: 'Method not allowed' })
    }
    
    const body = req.body || {}
    console.log('📧 Order ID:', body.orderId)
    console.log('📧 Customer Email:', body.customerEmail)

    // Check environment variables
    console.log('🔐 SMTP_USER:', process.env.SMTP_USER || 'NOT SET')
    console.log('🔐 GMAIL_USER:', process.env.GMAIL_USER || 'NOT SET')
    console.log('🔐 SMTP_PASS:', process.env.SMTP_PASS ? '***SET***' : 'NOT SET')
    console.log('🔐 GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '***SET***' : 'NOT SET')
    console.log('🔐 ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'NOT SET')

    const transporter = createTransporter()
    console.log('✅ Transporter created')
    
    const adminEmail = process.env.ADMIN_EMAIL || 'harshavardhanpenthala@gmail.com'

    // Generate actual PDF invoice
    const invoiceData = {
      orderId: body.orderId,
      paymentId: body.paymentId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
      orderItems: body.orderItems || [],
      orderTotal: body.orderTotal || 0,
      paymentMethod: body.paymentMethod || 'Razorpay',
      subtotal: body.subtotal,
      delivery: body.delivery,
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    
    console.log('📄 Using frontend invoice HTML for PDF...')
    const frontendHtml = body.invoiceHtml || generateInvoicePDF(invoiceData)
    const pdfBuffer = await generateActualPDFFromHtml(frontendHtml)
    console.log('📄 PDF generated successfully')
    
    const attachments = [{
      filename: `Invoice_${body.orderId || 'order'}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }]
    console.log('📎 Attachments:', 'Actual PDF Invoice attached')

    // Send to customer
    if (body.customerEmail) {
      console.log('📤 Sending email to customer:', body.customerEmail)
      const customerResult = await transporter.sendMail({
        from: process.env.SMTP_USER || 'moksh.dev0411@gmail.com',
        to: body.customerEmail,
        subject: '✅ Payment Successful - The Powder Legacy',
        html: renderCustomerEmail(body),
        attachments,
      })
      console.log('✅ Customer email sent successfully:', customerResult.messageId)
    } else {
      console.log('⚠️ No customer email provided, skipping customer notification')
    }

    // Send to admin
    console.log('📤 Sending email to admin:', adminEmail)
    console.log('📤 Admin email details:', {
      from: process.env.SMTP_USER || 'moksh.dev0411@gmail.com',
      to: adminEmail,
      subject: '🧾 New Order Paid - The Powder Legacy',
      hasAttachments: attachments ? attachments.length : 0
    })
    
    try {
      const adminResult = await transporter.sendMail({
        from: process.env.SMTP_USER || 'moksh.dev0411@gmail.com',
        to: adminEmail,
        subject: '🧾 New Order Paid - The Powder Legacy',
        html: renderAdminEmail(body),
        attachments,
      })
      console.log('✅ Admin email sent successfully:', adminResult.messageId)
    } catch (adminError) {
      console.error('❌ Admin email failed:', adminError.message)
      console.error('❌ Admin email error details:', adminError)
      throw adminError
    }

    console.log('🎉 All emails sent successfully!')
    return res.status(200).json({ success: true, message: 'Emails sent successfully' })
  } catch (e) {
    console.error('❌ EMAIL ERROR:', e)
    console.error('❌ Error message:', e?.message)
    console.error('❌ Error stack:', e?.stack)
    return res.status(500).json({ error: e?.message || 'Email send failed', details: e?.stack })
  }
}


