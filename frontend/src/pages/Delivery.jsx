import React from 'react'

const Delivery = () => {
  return (
    <div className='my-10'>
      <h1 className='text-3xl font-semibold text-gray-800 mb-6'>Delivery Information</h1>
      
      <div className='space-y-6 text-gray-700 max-w-2xl'>
        
        <section>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>Shipping Methods</h2>
          <ul className='list-disc list-inside space-y-2'>
            <li><strong>Standard Delivery:</strong> 5-7 business days (Free for orders over ₹500)</li>
            <li><strong>Express Delivery:</strong> 2-3 business days (₹99)</li>
            <li><strong>Overnight Delivery:</strong> Next business day (₹299, available in select areas)</li>
          </ul>
        </section>

        <section>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>Order Processing</h2>
          <p>
            Orders are processed Monday through Friday, 9 AM to 6 PM IST. Orders placed on weekends or holidays will be processed on the next business day. Once your order ships, you'll receive a tracking number via email.
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>Tracking Your Order</h2>
          <p>
            All orders come with tracking. You can monitor your package status in real time from our Orders page. Tracking updates are sent via email and SMS.
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>Delivery Areas</h2>
          <p>
            We deliver across India, including remote areas. Some regions may have extended delivery times. International shipping is not currently available.
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>Returns & Exchanges</h2>
          <p>
            You can initiate returns or exchanges within 7 days of delivery. Items must be unused and in original packaging. Return shipping is free for defective items; customer bears cost for change of mind returns.
          </p>
        </section>

      </div>
    </div>
  )
}

export default Delivery
