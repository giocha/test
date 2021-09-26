require('module-alias/register')

const User = require('@models/user.model')
const AppBaseError = require('@utils/appError.util')
const asyncCatch = require('@utils/asyncError.util')
const factory = require('@controllers/globalCrud.controller')


const filterObj = (obj, ...allowedFields) => {
	const newObj = {}
	Object.keys(obj).forEach( el => {
		if(allowedFields.includes(el)) {
			newObj[el] = obj[el]
		}
	})
	return newObj
}

const getAllUsers = asyncCatch( async (req, res, next) => {
	const users = await User.find()
	res.status(200).json({
		status : 'success',
		results : users.length,
		data : { users }
	})
})

const getUser = factory.getOne(User)

// const createUser = factory.createOne(User) // ? NOT NEEDED /// sign up exists

const updateUser = factory.updateOne(User)

const deleteUser = factory.deleteOne(User)

// = (req, res) =>
// 	res.status(500).json({
// 		status : 'error',
// 		message : 'This route is not yet defined . '
// 	})

const updateMe = asyncCatch ( async (req, res, next) => {
	if(req.body.password || req.body.passwordConfirm) {
		return next(new AppBaseError('This route is not for password update. Please use /updateMyPassword', 400))
	}
	const filteredBody = filterObj(req.body, 'name', 'email')
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new : true, runValidators : true})
	res.status(200).json({
		status : 'success',
		user : updatedUser
	})
})
const deleteMe = asyncCatch( async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, {active : false})
	res.status(204).json({
		status : 'success',
		data : null
	})
})

const getMe = (req, res, next) => {
	req.params.id = req.user.id
	next()
}

module.exports = { getAllUsers, getUser, updateUser, deleteUser, getMe, updateMe, deleteMe}






			
