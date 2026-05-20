import userModel from '../models/userModel.js';

// Get the cart for a user
const getCart = async (req, res) => {
	try {
		const { userId } = req.body;
		if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });

		const user = await userModel.findById(userId).lean();
		if (!user) return res.status(404).json({ success: false, message: 'User not found' });

		return res.status(200).json({ success: true, cart: user.cartData || {} });
	} catch (error) {
		console.error('getCart error:', error);
		return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
	}
};

// Add item(s) to cart. Payload: { userId, productId, size, quantity }
const addToCart = async (req, res) => {
	try {
		const { userId, productId, size, quantity } = req.body;
		if (!userId || !productId || !size) return res.status(400).json({ success: false, message: 'Missing required fields' });

		const qty = Number(quantity) || 1;

		const user = await userModel.findById(userId);
		if (!user) return res.status(404).json({ success: false, message: 'User not found' });

		const cart = user.cartData || {};

		if (!cart[productId]) cart[productId] = {};
		if (!cart[productId][size]) cart[productId][size] = 0;
		cart[productId][size] += qty;

		user.cartData = cart;
		await user.save();

		return res.status(200).json({ success: true, message: 'Item added to cart', cart });
	} catch (error) {
		console.error('addToCart error:', error);
		return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
	}
};

// Update quantity for a specific product/size. Payload: { userId, productId, size, quantity }
const updateCartItem = async (req, res) => {
	try {
		const { userId, productId, size, quantity } = req.body;
		if (!userId || !productId || !size) return res.status(400).json({ success: false, message: 'Missing required fields' });

		const qty = Number(quantity);
		if (isNaN(qty) || qty < 0) return res.status(400).json({ success: false, message: 'Invalid quantity' });

		const user = await userModel.findById(userId);
		if (!user) return res.status(404).json({ success: false, message: 'User not found' });

		const cart = user.cartData || {};
		if (!cart[productId]) cart[productId] = {};

		if (qty === 0) {
			// remove this size entry
			delete cart[productId][size];
			// if no sizes remain, remove product key
			if (Object.keys(cart[productId]).length === 0) delete cart[productId];
		} else {
			cart[productId][size] = qty;
		}

		user.cartData = cart;
		await user.save();

		return res.status(200).json({ success: true, message: 'Cart updated', cart });
	} catch (error) {
		console.error('updateCartItem error:', error);
		return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
	}
};

// Remove a product entirely from cart. Payload: { userId, productId }
const removeFromCart = async (req, res) => {
	try {
		const { userId, productId } = req.body;
		if (!userId || !productId) return res.status(400).json({ success: false, message: 'Missing required fields' });

		const user = await userModel.findById(userId);
		if (!user) return res.status(404).json({ success: false, message: 'User not found' });

		const cart = user.cartData || {};
		if (cart[productId]) {
			delete cart[productId];
			user.cartData = cart;
			await user.save();
		}

		return res.status(200).json({ success: true, message: 'Item removed from cart', cart });
	} catch (error) {
		console.error('removeFromCart error:', error);
		return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
	}
};

// Clear entire cart. Payload: { userId }
const clearCart = async (req, res) => {
	try {
		const { userId } = req.body;
		if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });

		const user = await userModel.findById(userId);
		if (!user) return res.status(404).json({ success: false, message: 'User not found' });

		user.cartData = {};
		await user.save();

		return res.status(200).json({ success: true, message: 'Cart cleared', cart: {} });
	} catch (error) {
		console.error('clearCart error:', error);
		return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
	}
};

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };

