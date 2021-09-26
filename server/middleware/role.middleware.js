require('module-alias/register')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('@models/user.model')
const asyncCatch = require('@utils/asyncError.util')
const AppBaseError = require('@utils/appError.util')



const protect = asyncCatch( async (req, res, next) => {
	let token
	if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1]
	}
	if(!token) {
		return next(new AppBaseError('You are not logged in, please login to get access', 401))
	}
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

	const currentUser = await User.findById(decoded.id)
	if(!currentUser) {
		return next(new AppBaseError('The user belonging to this token does not exist', 401))
	}

	if(currentUser.changedPasswordAfter(decoded.iat)) {
		return next(new AppBaseError('User recently changed password. Please log in again!', 401))
	}

	req.user = currentUser
	res.locals.user = currentUser
	next()
})


// const restrictTo = (...roles) => {
	
// 	return async (req, res, next) => {
// 		const user = await User.findOne(req.body.email).select('role')
// 		console.log('test',user)
// 		if(!roles.includes(user.role)) {
			
// 			return next(new AppBaseError('You do not have permission to perform this action.', 403))
// 		}
// 		next()
// 	}
// }

const restrictTo = (...roles) => {
	return (req, res, next) => {
	  // roles ['admin', 'lead-guide']. role='user'
	  if (!roles.includes(req.user.role)) {
		return next(
		  new AppBaseError('You do not have permission to perform this action', 403)
		);
	  }
  
	  next();
	};
  };

module.exports = { protect, restrictTo }


