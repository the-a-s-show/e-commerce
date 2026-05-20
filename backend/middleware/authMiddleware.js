import jwt from 'jsonwebtoken'

export const protect = (req, res, next) => {
  try {
    const auth = req.headers.authorization || req.headers.Authorization
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, token missing' })
    }

    const token = auth.split(' ')[1]
    const secret = process.env.JWT_SECRET || 'change-me-in-env'

    const decoded = jwt.verify(token, secret)
    // attach minimal user info
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email }
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' })
  }
}
