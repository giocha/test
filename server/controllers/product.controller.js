require('module-alias/register')
const glob = require('./globalCrud.controller')
const Product = require('@models/product.model')

exports.getAllProducts = glob.getAll(Product)
exports.getProduct = glob.getOne(Product)
exports.createProduct = glob.createOne(Product)
exports.updateProduct = glob.updateOne(Product)
exports.deleteProduct = glob.deleteOne(Product)