import productModel from '../models/productModel.js';

const addProduct = async (req, res) => {
	try {
		const { name, description, price, category, subCategory, sizes, bestseller, image1, image2, image3, image4 } = req.body;

		if (!name || !description || !price || !category || !subCategory || !sizes) {
			return res.status(400).json({ success: false, message: 'Missing required product fields' });
		}

		const images = [image1, image2, image3, image4].filter((item) => typeof item === 'string' && item.trim() !== '');

		if (images.length === 0) {
			return res.status(400).json({ success: false, message: 'Please provide at least one image URL' });
		}

		const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;

		const product = new productModel({
			name,
			description,
			price: Number(price),
			image: images,
			category,
			subCategory,
			sizes: Array.isArray(parsedSizes) ? parsedSizes : [],
			bestseller: bestseller === "true" || bestseller === true,
			date: Date.now(),
		});

		const saved = await product.save();
		return res.status(201).json({ success: true, message: 'Product added successfully', product: saved });
	} catch (error) {
		console.error('Error in addProduct:', error);
		return res.status(500).json({ success: false, message: error.message || 'Failed to add product' });
	}
};

const listProduct = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 0; // 0 means no limit
		const skip = limit > 0 ? (page - 1) * limit : 0;

		let query = {};
		if (req.query.category) query.category = req.query.category;
		if (req.query.subCategory) query.subCategory = req.query.subCategory;

		const productsQuery = productModel.find(query).sort({ date: -1 }).skip(skip);
		if (limit > 0) productsQuery.limit(limit);

		const products = await productsQuery.exec();
		const total = await productModel.countDocuments(query);

		return res.status(200).json({ success: true, total, products });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
	}
};

const removeProduct = async (req, res) => {
	try {
		const { id } = req.body;
		const productId = id || req.query.id || req.params.id;
		if (!productId) return res.status(400).json({ success: false, message: 'Product id is required' });

		const deleted = await productModel.findByIdAndDelete(productId);
		if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });

		return res.status(200).json({ success: true, message: 'Product removed' });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
	}
};

const singleProduct = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) return res.status(400).json({ success: false, message: 'Product id is required' });

		const product = await productModel.findById(id).exec();
		if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

		return res.status(200).json({ success: true, product });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
	}
};

export { listProduct, addProduct, removeProduct, singleProduct };

