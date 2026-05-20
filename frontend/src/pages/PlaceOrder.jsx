import React, { useState, useContext } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

    const [method, setMethod] = useState('cod');
    const navigate = useNavigate();
    const { cartItems, products, getCartAmount, backendUrl, setLastOrder, setToken, token } = useContext(ShopContext);

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (document.getElementById('razorpay-checkout-script')) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.id = 'razorpay-checkout-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const onPlaceOrder = async () => {
        try {
            setLoading(true);

            // Validate form
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.street || 
                !formData.city || !formData.state || !formData.zipcode || !formData.country || !formData.phone) {
                toast.error('Please fill all address fields');
                setLoading(false);
                return;
            }

            // Build items array from cart
            let items = [];
            for (const itemId in cartItems) {
                for (const size in cartItems[itemId]) {
                    if (cartItems[itemId][size] > 0) {
                        const product = products.find(p => p._id === itemId);
                        if (product) {
                            items.push({
                                productId: itemId,
                                name: product.name,
                                price: product.price,
                                quantity: cartItems[itemId][size],
                                size: size
                            });
                        }
                    }
                }
            }

            if (items.length === 0) {
                toast.error('Your cart is empty');
                setLoading(false);
                return;
            }

            const orderData = {
                userId: localStorage.getItem('userId') || 'guest-' + Date.now(),
                items,
                amount: getCartAmount(),
                address: formData,
                paymentMethod: method === 'cod' ? 'COD' : method === 'stripe' ? 'Stripe' : 'Razorpay'
            };

            if (method === 'stripe') {
                const response = await axios.post(backendUrl + '/api/order/stripe-checkout', orderData);

                if (response.data.success && response.data.url) {
                    const pendingOrder = {
                        ...orderData,
                        _id: response.data.sessionId,
                        status: 'Order Placed',
                        paymentMethod: 'Stripe',
                        date: new Date().toISOString()
                    };
                    setLastOrder(pendingOrder);
                    sessionStorage.setItem('lastOrder', JSON.stringify(pendingOrder));
                    window.location.href = response.data.url;
                } else {
                    toast.error(response.data.message || 'Unable to start Stripe checkout');
                }
                return;
            }

            if (method === 'razorpay') {
                const scriptLoaded = await loadRazorpayScript();

                if (!scriptLoaded) {
                    toast.error('Razorpay checkout failed to load');
                    return;
                }

                const response = await axios.post(backendUrl + '/api/order/razorpay-order', orderData);

                if (!response.data.success || !response.data.razorpayOrder) {
                    toast.error(response.data.message || 'Unable to start Razorpay payment');
                    return;
                }

                const razorpayOrder = response.data.razorpayOrder;
                const keyId = response.data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

                if (!keyId) {
                    toast.error('Razorpay key is missing');
                    return;
                }

                const options = {
                    key: keyId,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    name: 'XOR',
                    description: 'Order Payment',
                    order_id: razorpayOrder.id,
                    prefill: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        contact: formData.phone,
                    },
                    theme: {
                        color: '#111827',
                    },
                    handler: async function (paymentResponse) {
                        try {
                            const verifyResponse = await axios.post(backendUrl + '/api/order/razorpay-verify', {
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature,
                                ...orderData,
                                paymentMethod: 'Razorpay'
                            });

                            if (verifyResponse.data.success) {
                                const finalOrder = verifyResponse.data.order;
                                setLastOrder(finalOrder);
                                sessionStorage.setItem('lastOrder', JSON.stringify(finalOrder));
                                toast.success('Payment successful! Order placed.');
                                navigate('/order-confirmation');
                            } else {
                                toast.error(verifyResponse.data.message || 'Payment verification failed');
                            }
                        } catch (error) {
                            console.log(error);
                            toast.error(error.message || 'Payment verification failed');
                        }
                    },
                    modal: {
                        ondismiss: () => toast.error('Payment cancelled'),
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                return;
            }

            const response = await axios.post(backendUrl + '/api/order/place', orderData);

            if (response.data.success) {
                toast.success('Order placed successfully!');
                setLastOrder(response.data.order);
                navigate('/order-confirmation');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* ------------- Left Side ---------------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

        <div className='text-xl sm:text-2xl my-3'>
            <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
            <input name='firstName' onChange={handleInputChange} value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
            <input name='lastName' onChange={handleInputChange} value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>
        <input name='email' onChange={handleInputChange} value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input name='street' onChange={handleInputChange} value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
            <input name='city' onChange={handleInputChange} value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
            <input name='state' onChange={handleInputChange} value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
            <input name='zipcode' onChange={handleInputChange} value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
            <input name='country' onChange={handleInputChange} value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input name='phone' onChange={handleInputChange} value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
      </div>

      {/* ------------- Right Side ---------------- */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
            <CartTotal />
        </div>
        
        <div className='mt-12'>
            <Title text1={'PAYMENT'} text2={'METHOD'} />
            {/* --------------- Payment Method Selection ------------- */}
            <div className='flex gap-3 flex-col lg:flex-row'>
                <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                    <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                    <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
                </div>
                <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                    <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                    <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
                </div>
                <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                    <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                    <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                </div>
            </div>

            <div className='w-full text-end mt-8'>
                <button 
                    onClick={onPlaceOrder} 
                    disabled={loading}
                    className='bg-black text-white px-16 py-3 text-sm disabled:bg-gray-400'
                >
                    {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
