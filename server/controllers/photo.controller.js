require('module-alias/register')
const multer = require('multer')
const AppBaseError = require('@utils/appError.util')


const multerStorage = multer.diskStorage({
	
	destination : (req, file, cb) => {
		console.log(req)
		cb( null, 'client/img/products' )
	},
	filename : (req, file, cb) => {
		const ext = file.mimetype.split('/')[1]
		cb(null, `product-${req.user.id}-${Date.now()}.${ext}`)
	}
})


const multerFilter = (req, file, cb) => {
	if(file.mimetype.startsWith('image')) {
		cb(null, true)
	} else {
		cb(new AppBaseError('Not an image! Please upload only images', 400), false)
	}
}

const upload = multer({
	storage : multerStorage,
	fileFilter : multerFilter
})


module.exports = upload

