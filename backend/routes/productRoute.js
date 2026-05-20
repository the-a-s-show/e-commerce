import express from 'express'
import { listProduct, addProduct, removeProduct, singleProduct } from '../controllers/productController.js'
import adminAuth from '../middleware/adminAuth.js'

const router = express.Router()

router.post('/add', adminAuth, addProduct)
router.post('/remove', adminAuth, removeProduct)
router.post('/single', singleProduct)
router.get('/list', listProduct)

export default router
    