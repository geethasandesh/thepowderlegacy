// Test Welcome Email Script
// Run with: node scripts/test-welcome-email.js
// Make sure the API server is running first: npm run server

const testWelcomeEmail = async () => {
  console.log('🧪 Testing Signup Welcome Email...')
  
  const testPayload = {
    emailType: 'signup-welcome',
    leadData: {
      name: 'Test Customer',
      email: 'harshav123.mru@gmail.com', // Replace with your test email
      resetPasswordUrl: null // Set to a URL if you want to test password reset link
    }
  }

  try {
    console.log('📤 Sending test request to http://localhost:3001/api/send-lead-email')
    console.log('📧 Expected recipient:', testPayload.leadData.email)
    
    const response = await fetch('http://localhost:3001/api/send-lead-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    })

    console.log('📥 Response status:', response.status)
    
    const result = await response.json()
    console.log('📥 Response body:', result)

    if (response.ok) {
      console.log('✅ WELCOME EMAIL TEST PASSED!')
      console.log('📧 Check your email inbox for the welcome email')
      console.log('\n📝 Email should include:')
      console.log('   ✓ TPL Logo and branding')
      console.log('   ✓ Welcome message')
      console.log('   ✓ Account details (name & email)')
      console.log('   ✓ What you can do now section')
      console.log('   ✓ Social media links (Facebook & Instagram)')
      console.log('   ✓ Contact info with WhatsApp number')
    } else {
      console.log('❌ WELCOME EMAIL TEST FAILED!')
      console.log('Error:', result)
    }
  } catch (error) {
    console.error('❌ TEST ERROR:', error.message)
    console.log('\n⚠️ Make sure the API server is running:')
    console.log('   npm run server')
  }
}

// Run the test
console.log('=' .repeat(60))
console.log('📧 WELCOME EMAIL TEST')
console.log('=' .repeat(60))
console.log('')

testWelcomeEmail()

