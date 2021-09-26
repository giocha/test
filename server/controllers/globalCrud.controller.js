require('module-alias/register')
const AppBaseError = require("@utils/appError.util")
const asyncCatch = require("@utils/asyncError.util")
const APIfeatures = require('@utils/methodsAPI.util')


exports.deleteOne = Model => 
	asyncCatch ( async ( req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id)
		if(!doc) {
			return next(new AppBaseError('No document found with tha ID', 404))
		}

		res.status(204).json({
			status : 'success',
			data : null
		})
	})

exports.updateOne = Model =>
	asyncCatch( async (req, res, next) => {
		// console.log(req.file)
		// console.log(req.body)
		if(req.file) req.body.photo = req.file.filename
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new : true,
			runValidators : true
		})

		console.log(req.body) // DEN PREPEI NA KANEI UPDATE TO PASSWORD !
		if(req.body.password) {
			return next(new AppBaseError('This is not allowed. Change password at /updatedMyPassword'))
		}
		if( !doc) {
			return next(new AppBaseError('No document found with that ID', 404))
		}

		res.status(200).json({
			status : 'success',
			data : {
				data : doc
			}
		})
	})

exports.createOne = Model =>
	asyncCatch(async (req, res, next) => {
	  const doc = await Model.create(req.body);
		
	  res.status(201).json({
		status: 'success',
		data: {
		  data: doc
		}
	  });
	});

exports.getOne = (Model, popOptions) =>
	asyncCatch ( async ( req, res, next) => {
		
		let query = Model.findById(req.params.id)
		if(popOptions) query = query.populate(popOptions)
		const doc = await query
		res.status(201).json({
			status : 'success',
			data : {
				data : doc
			}
		})
	})

// exports.createOne THA DOUME..

exports.getAll = Model => 
	asyncCatch( async (req, res, next) => {
		// console.log(req.query)
		// let filter = {}
		// if (req.params.id) filter = { product : req.params.id }
		// const features = new APIfeatures(Model.find(filter), req.query)
		// .filter()
		// .sort()
		// .limitFields()
		// .paginate()
		// const doc = await features.query
		// ! thelei fix gia tis methodous tou API
		const doc = await Model.find()
		res.status(200).json({
			status : 'success',
			results : doc.length,
			data : {
				data : doc
			}
		})
	})







