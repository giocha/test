require('module-alias/register')


// const createSendToken
const { createSendToken } = require('@utils/token.util')
const asyncCatch = require('@utils/asyncError.util')
const User = require('@models/user.model')
const AppBaseError = require('@utils/appError.util')
const { promisify } = require('util');
const jwt = require('jsonwebtoken');


const signup = asyncCatch ( async (req, res, next) => {
	if(req.body.role || req.body.active) {
		return next(new AppBaseError('Contact the administrator for collaboration'))
	}
	const newUser = await User.create(req.body) // ******
	const url = `${req.protocol}://${req.get('host')}/vineyards/users/me`
	console.log(url)
	// await new Email(newUser, url).sendWelcome()
	createSendToken(newUser, 201, res)
})

const login = asyncCatch( async (req, res, next) => {
	const { email, password } = req.body
	if(!email || !password) {
		return next(new AppBaseError('Please provide email and password', 400))
	}
	const user = await User.findOne({ email }).select('+password')
	console.log('O USER EINAI : ', user)
	if(!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppBaseError('Incorrect email or password', 401))
	}
	createSendToken(user, 200, res)
})

const logout = (req, res) => {
	res.cookie('jwt', 'loggedout', {
		expires : new Date(Date.now() + 10 * 1000),
		httpOnly : true
	})
	res.status(200).json({
		status : 'success'
	})
}


const isLoggedIn = async (req, res, next) => {
	if( req.cookies.jwt) {
		try {
			const decoded = await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.JWT_SECRET
			)

			const currentUser = await User.findById(decoded.id)
			if(!currentUser) { return next() }
			if(currentUser.changedPasswordAfter(decoded.iat)) {
				return next()
			}
			res.locals.user = currentUser
			return next()
		} catch(err) {
			next()
		}
	}
	next()
}

module.exports = { signup , login, logout, isLoggedIn }