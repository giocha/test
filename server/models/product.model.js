const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const productSchema = new mongoose.Schema({
	title : {
		type : String,
		required : true,
		unique : true,
		maxLength : [25, 'Maximum 25 characters are allowed'],
	},
	photo : {
		type : String,
		
		default : 'default.jpg'
	},
	price : {
		type : Number,
		required : true
	},
	aroma : {
		type : String,
		
	},
	flavor : {
		type : String,
		
	},
	finish : {
		type : String,
	},
	alcohol : {
		type : String
	},
	stock : {
		type : Number,
		required : true,
		default : 0
	},
	timestamps : {}

})

const Product = mongoose.model('Product', productSchema)

module.exports = Product