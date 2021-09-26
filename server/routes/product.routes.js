const express = require('express')
require('module-alias/register')
const uploadProductPhoto = require('@middleware/photo.middleware')
const {
	getAllProducts,
	getProduct,
	updateProduct,
	deleteProduct,
	createProduct
} = require('@controllers/product.controller')

const  {
	protect,
	restrictTo
} = require('@middleware/role.middleware')


const router = express.Router()

router.route('/').get(getAllProducts).post(protect, restrictTo('admin'), uploadProductPhoto, createProduct)
router.route('/:id').get(getProduct).patch(protect, restrictTo('admin'), uploadProductPhoto, updateProduct).delete(protect, restrictTo('admin'), deleteProduct)


module.exports = router