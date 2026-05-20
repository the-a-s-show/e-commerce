import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
	try {
		// support both Authorization: Bearer <token> and token: <token>
		let token = null;
		const authHeader = req.headers.authorization || req.headers.Authorization;
		if (authHeader && authHeader.startsWith('Bearer ')) {
			token = authHeader.split(' ')[1];
		} else if (req.headers.token) {
			token = req.headers.token;
		}

		if (!token) {
			return res.status(401).json({ success: false, message: 'Not Authorized, token missing' });
		}

		const secret = process.env.JWT_SECRET || 'change-me-in-env';
		const decoded = jwt.verify(token, secret);

		// attach user info to request
		req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
		next();
	} catch (error) {
		console.error('auth middleware error:', error.message);
		return res.status(401).json({ success: false, message: 'Not Authorized, token invalid' });
	}
}

export default auth;

