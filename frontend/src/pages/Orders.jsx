import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Orders = () => {

  const { backendUrl, token, userId, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      // need a user id to fetch orders
      const uid = userId || localStorage.getItem('userId');
      if (!uid) return;

      try {
        setLoading(true);
        const response = await axios.post(backendUrl + '/api/order/user-orders', { userId: uid }, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (response.data && response.data.success) {
          setOrders(response.data.orders || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [backendUrl, token, userId]);

  if (!userId && !localStorage.getItem('userId')) {
    return (
      <div className='border-t pt-16'>
        <div className='text-2xl'>
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>
        <div className='mt-8 text-gray-700'>
          <p>Please <Link to='/login' className='text-blue-600'>login</Link> to view your orders.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='border-t pt-16'>

      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className='mt-6'>
        {loading && <p className='text-gray-500'>Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <p className='text-gray-500'>You have no orders yet.</p>
        )}

        {
          orders.map((order) => (
            <div key={order._id} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm w-full'>
                <div className='flex-1'>
                  <p className='sm:text-base font-medium'>Order #{order._id}</p>
                  <p className='text-sm text-gray-500 mt-1'>Placed: {new Date(order.date).toLocaleString()}</p>
                  <p className='text-sm mt-2'>Amount: <strong>{currency}{order.amount}</strong></p>
                  <p className='text-sm mt-1'>Status: <span className='text-gray-600'>{order.status}</span></p>
                </div>
                <div className='flex flex-col items-end gap-2'>
                  <button onClick={() => setExpanded(prev => ({ ...prev, [order._id]: !prev[order._id] }))} className='border px-4 py-2 text-sm font-medium rounded-sm'>Details</button>
                  <Link to={`/orders/${order._id}`} className='text-sm text-blue-600'>View page</Link>
                </div>
              </div>

              {expanded[order._id] && (
                <div className='mt-4 w-full'>
                  {order.items.map((it, idx) => (
                    <div key={idx} className='flex items-center gap-4 py-2'>
                      <img className='w-16' src={it.image || it.imageUrl || ''} alt="" />
                      <div>
                        <p className='font-medium'>{it.name}</p>
                        <p className='text-sm text-gray-500'>Qty: {it.quantity} • Size: {it.size}</p>
                      </div>
                      <div className='ml-auto'>
                        <p className='text-sm'>{currency}{it.price}</p>
                      </div>
                    </div>
                  ))}
                  <div className='text-sm text-gray-600 mt-2'>Shipping to: {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipcode}</div>
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders
