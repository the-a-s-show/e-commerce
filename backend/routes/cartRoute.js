import express from 'express'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../config/cartController.js'
import auth from '../middleware/auth.js'

const cartRouter = express.Router()

// All cart routes require an authenticated user (token)
cartRouter.post('/get', auth, getCart)
cartRouter.post('/add', auth, addToCart)
cartRouter.post('/update', auth, updateCartItem)
cartRouter.post('/remove', auth, removeFromCart)
cartRouter.post('/clear', auth, clearCart)

export default cartRouter
