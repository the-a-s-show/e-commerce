import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className='my-10'>
      <h1 className='text-3xl font-semibold text-gray-800 mb-6'>Privacy Policy</h1>
      
      <div className='space-y-6 text-gray-700 max-w-2xl'>
        
        <section>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>Information We Collect</h2>
          <p>
            We collect information you provide directly (name, email, phone, shipping address) and information automatically (IP address, browser type, pages visited, and cookies).
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>How We Use Your Data</h2>
          <ul className='list-disc list-inside space-y-2'>
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and updates</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Improve our website and services</li>
            <li>Send promotional emails (you can opt out anytime)</li>
          </ul>
        </section>

        <section>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>Payment Security</h2>
          <p>
            Payment information is processed securely through PCI-DSS compliant payment gateways (Stripe & Razorpay). We do not store full credit card details on our servers.
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>Data Sharing</h2>
          <p>
            We never sell your personal data. We only share information with trusted partners (shipping, payment providers) who are contractually bound to protect your privacy.
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>Your Rights</h2>
          <p>
            You can request to view, update, or delete your personal data at any time. Contact us at contact@xor.com with your request.
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>Cookies</h2>
          <p>
            We use cookies to enhance your shopping experience and analyze site usage. You can disable cookies in your browser settings, though some features may be limited.
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>Changes to This Policy</h2>
          <p>
            We may update this privacy policy periodically. Changes will be posted on this page with an updated effective date.
          </p>
        </section>

      </div>
    </div>
  )
}

export default PrivacyPolicy
