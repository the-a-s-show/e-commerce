import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { products as localProducts } from '../assets/assets';

export const ShopContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const [products, setProducts] = useState(localProducts);
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
    const [lastOrder, setLastOrder] = useState(() => {
        try {
            const savedOrder = sessionStorage.getItem('lastOrder');
            return savedOrder ? JSON.parse(savedOrder) : null;
        } catch (error) {
            return null;
        }
    });

    // helper to decode JWT payload (no verification) to extract user id
    const decodeJwt = (jwtToken) => {
        try {
            const payload = jwtToken.split('.')[1];
            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            return decoded;
        } catch (error) {
            return null;
        }
    }

    // when token changes, update userId from token if possible
    useEffect(() => {
        if (token) {
            const payload = decodeJwt(token);
            if (payload && payload.id) {
                setUserId(payload.id);
                localStorage.setItem('userId', payload.id);
            }
        }
    }, [token]);

    useEffect(() => {
        if (lastOrder) {
            sessionStorage.setItem('lastOrder', JSON.stringify(lastOrder));
        } else {
            sessionStorage.removeItem('lastOrder');
        }
    }, [lastOrder]);

    const getProductData = async () => {
        try {
            const response = await fetch(backendUrl + '/api/product/list');
            const data = await response.json();

            if (data.success) {
                const backendProducts = Array.isArray(data.products) ? data.products : [];
                setProducts([...localProducts, ...backendProducts]);
            } else {
                toast.error(data.message || 'Failed to load products');
                setProducts(localProducts);
            }
        } catch (error) {
            console.log(error);
            toast.error('Unable to connect to backend');
            setProducts(localProducts);
        }
    }

    useEffect(() => {
        getProductData();
    }, []);

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        getProductData,
        backendUrl,
        token,
        userId,
        setToken,
        lastOrder,
        setLastOrder
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;