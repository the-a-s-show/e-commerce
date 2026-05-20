import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const statusOptions = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']
const currency = '₹'

const PackageIcon = () => (
  <div className="w-12 h-12 border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.7">
      <path d="M3.75 7.5 12 3.75l8.25 3.75-8.25 3.75L3.75 7.5Z" />
      <path d="M3.75 7.5V16.5L12 20.25l8.25-3.75V7.5" />
      <path d="M12 11.25v9" />
      <path d="M7.5 9.25 12 11.25l4.5-2" />
    </svg>
  </div>
)

const Orders = ({ token, title = 'Order Page', fetchPath = '/api/order/list' }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        backendUrl + fetchPath,
        { headers: { token } }
      )

      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: newStatus },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success('Order status updated')
        await fetchOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-gray-700">{title}</h2>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 text-sm rounded bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No orders found.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border border-gray-200 p-6 bg-white flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex items-start gap-5 flex-1 min-w-0">
                  <PackageIcon />

                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] leading-6 text-gray-700">
                      {order.items.map((item, index) => (
                        <div key={`${order._id}-${index}`} className="truncate">
                          {item.name} x {item.quantity} {item.size}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <p className="font-semibold text-gray-700">
                        {order.address.firstName} {order.address.lastName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{order.address.street}</p>
                      <p className="text-sm text-gray-600">{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                      <p className="text-sm text-gray-600">{order.address.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-start lg:min-w-[260px]">
                  <div className="text-sm text-gray-700 space-y-1 sm:w-[150px] lg:w-auto">
                    <p>Items : {order.items.length}</p>
                    <p>Method : {order.paymentMethod}</p>
                    <p>Payment : {order.payment ? 'Paid' : 'Pending'}</p>
                    <p>Date : {new Date(order.date).toLocaleDateString()}</p>
                  </div>

                  <div className="sm:text-right lg:text-left">
                    <p className="text-lg font-medium text-gray-700">{currency}{order.amount}</p>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="w-full sm:w-[170px] lg:w-[170px] px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:border-gray-400"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <p>Tip: Click on the status dropdown to update an order's fulfillment status.</p>
      </div>
    </div>
  )
}

export default Orders
