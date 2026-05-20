import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const currency = '₹';

const OrderTrack = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/order/single/${orderId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to fetch order');
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const statuses = [
    'Order Placed',
    'Packing',
    'Shipped',
    'Out for delivery',
    'Delivered',
  ];

  const currentIndex = order ? statuses.indexOf(order.status) : -1;

  if (loading) return <div className="p-6">Loading order...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Order Tracking</h2>
        <p className="text-sm text-gray-600">Order ID: {order._id}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-medium">Status</h3>
        <div className="mt-3">
          {statuses.map((s, idx) => (
            <div key={s} className="flex items-center mb-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  idx <= currentIndex ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {idx <= currentIndex ? '✓' : idx + 1}
              </div>
              <div>
                <div className="font-semibold">{s}</div>
                {idx === currentIndex && <div className="text-sm text-gray-600">Current</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium">Shipping Address</h3>
        <div className="mt-2 text-gray-700">
          {order.address && (
            <div>
              <div>{order.address.firstName} {order.address.lastName}</div>
              <div>{order.address.street}</div>
              <div>{order.address.city}, {order.address.state} {order.address.zipcode}</div>
              <div>{order.address.phone}</div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium">Items</h3>
        <div className="mt-3 space-y-3">
          {order.items && order.items.map((item, idx) => (
            <div key={idx} className="flex items-center">
              <img src={item.image || item.imageUrl || ''} alt={item.name} className="w-16 h-16 object-cover mr-4" />
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                <div className="text-sm text-gray-600">Price: {currency}{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <div className="text-gray-600">Placed: {order.date ? new Date(order.date).toLocaleString() : ''}</div>
          <div className="text-gray-800 font-semibold">Total: {currency}{order.amount || order.total}</div>
        </div>
        <div>
          <Link to="/orders" className="px-4 py-2 bg-gray-200 rounded">Back to Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTrack;
