import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Title from '../components/Title'
import axios from 'axios'

const OrderConfirmation = () => {
  const { lastOrder, setLastOrder, currency, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(Boolean(sessionId));

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const loadOrder = async () => {
      try {
        if (sessionId) {
          for (let attempt = 0; attempt < 5; attempt += 1) {
            try {
              const response = await axios.get(`${backendUrl}/api/order/stripe-session/${sessionId}`);
              if (response.data.success) {
                setLastOrder(response.data.order);
                return;
              }
            } catch (error) {
              if (attempt === 4) {
                throw error;
              }
              await wait(1000);
            }
          }
        }

        if (!lastOrder) {
          const savedOrder = sessionStorage.getItem('lastOrder');
          if (savedOrder) {
            setLastOrder(JSON.parse(savedOrder));
          }
        }
      } catch (error) {
        console.log(error);
        if (!lastOrder) {
          try {
            const savedOrder = sessionStorage.getItem('lastOrder');
            if (savedOrder) {
              setLastOrder(JSON.parse(savedOrder));
            }
          } catch (fallbackError) {
            console.log(fallbackError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [backendUrl, lastOrder, sessionId, setLastOrder]);

  // Redirect if no order in context (user navigated directly)
  if (!lastOrder) {
    if (loading) {
      return (
        <div className='border-t pt-16'>
          <div className='text-2xl'>
            <Title text1={'ORDER'} text2={'CONFIRMATION'} />
          </div>
          <div className='mt-8 text-gray-500 text-center'>
            <p>Loading order details...</p>
          </div>
        </div>
      );
    }

    return (
      <div className='border-t pt-16'>
        <div className='text-2xl'>
          <Title text1={'ORDER'} text2={'CONFIRMATION'} />
        </div>
        <div className='mt-8 text-gray-500 text-center'>
          <p>No order found. Please place an order first.</p>
          <button 
            onClick={() => navigate('/')}
            className='mt-4 bg-black text-white px-8 py-2 rounded'
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1={'ORDER'} text2={'CONFIRMATION'} />
      </div>

      {/* Success Message */}
      <div className='mb-8 p-6 bg-green-50 border border-green-200 rounded'>
        <div className='flex items-center gap-3 mb-2'>
          <p className='w-4 h-4 rounded-full bg-green-500'></p>
          <p className='text-lg font-medium text-green-700'>Order Placed Successfully!</p>
        </div>
        <p className='text-sm text-green-600'>Thank you for your order. You will receive an email confirmation shortly.</p>
      </div>

      {/* Order Details */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
        
        {/* Left: Order Info */}
        <div className='border p-6 rounded'>
          <h3 className='text-lg font-semibold mb-4'>Order Details</h3>
          
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between border-b pb-2'>
              <span className='text-gray-600'>Order ID:</span>
              <span className='font-medium'>{lastOrder._id || lastOrder.orderId}</span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='text-gray-600'>Date:</span>
              <span className='font-medium'>{lastOrder.date ? new Date(lastOrder.date).toLocaleString() : lastOrder.createdAt ? new Date(lastOrder.createdAt).toLocaleString() : ''}</span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='text-gray-600'>Payment Method:</span>
              <span className='font-medium'>{lastOrder.paymentMethod}</span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='text-gray-600'>Order Status:</span>
              <span className='font-medium text-orange-600'>{lastOrder.status || 'Order Placed'}</span>
            </div>

            <div className='flex justify-between pt-2'>
              <span className='font-semibold'>Total Amount:</span>
              <span className='font-bold text-lg'>{currency}{lastOrder.amount || lastOrder.total}</span>
            </div>
          </div>
        </div>

        {/* Right: Shipping Address */}
        <div className='border p-6 rounded'>
          <h3 className='text-lg font-semibold mb-4'>Shipping Address</h3>
          
          <div className='text-sm space-y-2 text-gray-700'>
            <p className='font-medium'>{lastOrder.address.firstName} {lastOrder.address.lastName}</p>
            <p>{lastOrder.address.street}</p>
            <p>{lastOrder.address.city}, {lastOrder.address.state} {lastOrder.address.zipcode}</p>
            <p>{lastOrder.address.country}</p>
            <p className='pt-2 border-t'>Phone: {lastOrder.address.phone}</p>
            <p>Email: {lastOrder.address.email}</p>
          </div>
        </div>

      </div>

      {/* Order Items */}
      <div className='border p-6 rounded mb-8'>
        <h3 className='text-lg font-semibold mb-4'>Order Items</h3>
        
        <div className='space-y-4'>
          {lastOrder.items.map((item, idx) => (
            <div key={idx} className='flex items-center justify-between border-b pb-4'>
              <div className='flex-1'>
                <p className='font-medium'>{item.name}</p>
                <p className='text-sm text-gray-600'>Qty: {item.quantity} • Size: {item.size}</p>
              </div>
              <div className='text-right'>
                <p className='font-medium'>{currency}{item.price}</p>
                <p className='text-sm text-gray-600'>Subtotal: {currency}{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className='mt-6 space-y-2 text-right'>
          <div className='flex justify-end gap-4'>
            <span className='text-gray-600'>Subtotal:</span>
            <span className='font-medium'>{currency}{(lastOrder.amount - 10).toFixed(2)}</span>
          </div>
          <div className='flex justify-end gap-4'>
            <span className='text-gray-600'>Delivery Fee:</span>
            <span className='font-medium'>{currency}10.00</span>
          </div>
          <div className='flex justify-end gap-4 border-t pt-2 text-lg font-bold'>
            <span>Total:</span>
            <span>{currency}{lastOrder.amount}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 justify-center mb-8'>
        <button 
          onClick={() => navigate('/orders')}
          className='border border-black px-8 py-3 rounded font-medium hover:bg-gray-100'
        >
          Track Order
        </button>
        <button 
          onClick={() => navigate('/')}
          className='bg-black text-white px-8 py-3 rounded font-medium hover:bg-gray-800'
        >
          Continue Shopping
        </button>
      </div>

      {/* Additional Info */}
      <div className='bg-blue-50 border border-blue-200 p-4 rounded text-sm text-gray-700'>
        <p className='font-semibold mb-2'>What's Next?</p>
        <ul className='list-disc list-inside space-y-1'>
          <li>You will receive an order confirmation email shortly</li>
          <li>Your order will be processed and shipped within 2-3 business days</li>
          <li>Track your order status from your profile → Orders page</li>
          <li>For any queries, contact our support team</li>
        </ul>
      </div>
    </div>
  )
}

export default OrderConfirmation
