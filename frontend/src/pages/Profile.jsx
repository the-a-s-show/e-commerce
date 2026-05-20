import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Title from '../components/Title'

const Profile = () => {
  const navigate = useNavigate();
  const { token, backendUrl, currency } = useContext(ShopContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    country: ''
  });

  const [editData, setEditData] = useState({ ...profileData });

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Load user profile and orders
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      try {
        // Get user orders
        const response = await axios.post(
          `${backendUrl}/api/order/user-orders`,
          {},
          { headers: { token } }
        );
        if (response.data.success) {
          setUserOrders(response.data.orders);
        }
        
        // Parse token to get user info (basic data from JWT)
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const decoded = JSON.parse(atob(tokenParts[1]));
          setProfileData(prev => ({
            ...prev,
            email: decoded.id || '',
            name: localStorage.getItem('userName') || 'User'
          }));
          setEditData(prev => ({
            ...prev,
            email: decoded.id || '',
            name: localStorage.getItem('userName') || 'User'
          }));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [token, backendUrl]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      // In a real app, you'd send this to a backend endpoint like PATCH /api/user/update-profile
      localStorage.setItem('userName', editData.name);
      setProfileData({ ...editData });
      setIsEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditMode(false);
  };

  return (
    <div className='min-h-screen bg-white'>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      <div className='my-10 max-w-4xl mx-auto px-4'>
        {/* Profile Card */}
        <div className='bg-gray-50 p-8 rounded-lg shadow-sm'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-semibold text-gray-800'>Account Information</h2>
            {!isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className='bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800'
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditMode ? (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                  <input
                    type='text'
                    name='name'
                    value={editData.name}
                    onChange={handleEditChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={editData.email}
                    disabled
                    className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phone</label>
                  <input
                    type='tel'
                    name='phone'
                    value={editData.phone}
                    onChange={handleEditChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Address</label>
                  <input
                    type='text'
                    name='address'
                    value={editData.address}
                    onChange={handleEditChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>City</label>
                  <input
                    type='text'
                    name='city'
                    value={editData.city}
                    onChange={handleEditChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>State</label>
                  <input
                    type='text'
                    name='state'
                    value={editData.state}
                    onChange={handleEditChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Zip Code</label>
                  <input
                    type='text'
                    name='zipcode'
                    value={editData.zipcode}
                    onChange={handleEditChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Country</label>
                  <input
                    type='text'
                    name='country'
                    value={editData.country}
                    onChange={handleEditChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  />
                </div>
              </div>
              <div className='flex gap-4 mt-6'>
                <button
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className='bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400'
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className='bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400'
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className='space-y-3 text-gray-700'>
              <p><span className='font-semibold'>Name:</span> {profileData.name || 'Not provided'}</p>
              <p><span className='font-semibold'>Email:</span> {profileData.email || 'Not provided'}</p>
              <p><span className='font-semibold'>Phone:</span> {profileData.phone || 'Not provided'}</p>
              <p><span className='font-semibold'>Address:</span> {profileData.address || 'Not provided'}</p>
              {profileData.city && <p><span className='font-semibold'>City:</span> {profileData.city}</p>}
              {profileData.state && <p><span className='font-semibold'>State:</span> {profileData.state}</p>}
              {profileData.zipcode && <p><span className='font-semibold'>Zip Code:</span> {profileData.zipcode}</p>}
              {profileData.country && <p><span className='font-semibold'>Country:</span> {profileData.country}</p>}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className='mt-12'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Recent Orders</h2>
          {userOrders.length > 0 ? (
            <div className='space-y-4'>
              {userOrders.slice(0, 5).map((order) => (
                <div key={order._id} className='bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 transition'>
                  <div>
                    <p className='font-semibold text-gray-800'>Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className='text-sm text-gray-600'>
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className='text-sm text-gray-600'>{order.items.length} item(s) • Status: <span className='font-medium'>{order.status}</span></p>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold text-lg'>{currency}{order.amount}</p>
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className='text-sm text-black underline hover:no-underline mt-2'
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-gray-50 p-8 rounded-lg text-center'>
              <p className='text-gray-600 mb-4'>You haven't placed any orders yet.</p>
              <button
                onClick={() => navigate('/collection')}
                className='bg-black text-white px-6 py-2 rounded hover:bg-gray-800'
              >
                Start Shopping
              </button>
            </div>
          )}
          {userOrders.length > 5 && (
            <div className='text-center mt-6'>
              <button
                onClick={() => navigate('/orders')}
                className='text-black underline hover:no-underline'
              >
                View All Orders →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
