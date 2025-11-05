// Email testing script
// Run with: node scripts/email.js

const testOrderEmail = async () => {
  console.log('🧪 Testing Order Confirmation Email...')
  
  const testPayload = {
    orderId: 'test_order_' + Date.now(),
    paymentId: 'test_payment_' + Date.now(),
    customerName: 'Test Customer',
    customerEmail: 'harshav123.mru@gmail.com',
    customerPhone: '9876543210',
    orderItems: [
      { title: 'Test Product (250g)', quantity: 1, price: 700 }
    ],
    orderTotal: 750,
    subtotal: 700,
    delivery: 50,
    paymentMethod: 'Razorpay',
    customerAddress: 'Test Address\nTest City, Test State 123456\nIndia\nPhone: 9876543210',
    invoiceHtml: '<!DOCTYPE html><html><head><title>Invoice</title></head><body><h1>Test Invoice</h1></body></html>'
  }

  try {
    console.log('📤 Sending test request to http://localhost:3001/api/send-order-email')
    console.log('📧 Expected recipients:')
    console.log('   👤 Customer: harshav123.mru@gmail.com (Order Confirmation)')
    console.log('   👨‍💼 Admin: harshavardhanpenthala@gmail.com (New Order Alert)')
    
    const response = await fetch('http://localhost:3001/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    })

    console.log('📥 Response status:', response.status)
    
    const result = await response.json()
    console.log('📥 Response body:', result)

    if (response.ok) {
      console.log('✅ ORDER EMAIL TEST PASSED!')
      console.log('📧 Check both email inboxes for confirmation emails')
    } else {
      console.log('❌ ORDER EMAIL TEST FAILED!')
    }
  } catch (error) {
    console.error('❌ TEST ERROR:', error.message)
    console.log('\n⚠️ Make sure the API server is running:')
    console.log('   npm run server')
  }
}

const testFailedPaymentEmail = async () => {
  console.log('\n🧪 Testing Failed Payment Email...')
  
  const testPayload = {
    orderId: 'failed_order_' + Date.now(),
    paymentId: null,
    customerName: 'Test Customer',
    customerEmail: 'harshav123.mru@gmail.com',
    customerPhone: '9876543210',
    orderItems: [
      { title: 'Test Product (250g)', quantity: 1, price: 700 }
    ],
    orderTotal: 750,
    subtotal: 700,
    delivery: 50,
    paymentMethod: 'Razorpay',
    customerAddress: 'Test Address\nTest City, Test State 123456\nIndia\nPhone: 9876543210',
    paymentStatus: 'FAILED',
    errorMessage: 'Card declined by bank'
  }

  try {
    console.log('📤 Sending test request to http://localhost:3001/api/send-failed-payment-email')
    console.log('📧 Expected recipients:')
    console.log('   👤 Customer: harshav123.mru@gmail.com (Payment Issue)')
    console.log('   👨‍💼 Admin: harshavardhanpenthala@gmail.com (Payment Failed Alert)')
    
    const response = await fetch('http://localhost:3001/api/send-failed-payment-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    })

    console.log('📥 Response status:', response.status)
    
    const result = await response.json()
    console.log('📥 Response body:', result)

    if (response.ok) {
      console.log('✅ FAILED PAYMENT EMAIL TEST PASSED!')
      console.log('📧 Check both email inboxes for failure notification emails')
    } else {
      console.log('❌ FAILED PAYMENT EMAIL TEST FAILED!')
    }
  } catch (error) {
    console.error('❌ TEST ERROR:', error.message)
    console.log('\n⚠️ Make sure the API server is running:')
    console.log('   npm run server')
  }
}

// Main execution
const runTests = async () => {
  console.log('=' .repeat(60))
  console.log('📧 EMAIL SYSTEM TEST SUITE')
  console.log('=' .repeat(60))
  
  await testOrderEmail()
  
  // Wait 2 seconds between tests
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  await testFailedPaymentEmail()
  
  console.log('\n' + '=' .repeat(60))
  console.log('✅ ALL EMAIL TESTS COMPLETED')
  console.log('=' .repeat(60))
  console.log('\n📬 Check your email inboxes:')
  console.log('   • harshav123.mru@gmail.com (Customer emails)')
  console.log('   • harshavardhanpenthala@gmail.com (Admin emails)')
}

runTests()

