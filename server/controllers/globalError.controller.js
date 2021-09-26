require('module-alias/register')

const AppBaseError = require('@utils/appError.util')

const handleCastErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value}.`
	return new AppBaseError(message, 400)
}

const handleDuplicateFieldsDB = err => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)
	console.log(value)
	const message = `Duplicate field value: ${value}. Please use another value!`
	return new AppBaseError(message, 400)
}

const handleJWTerror = err => new AppBaseError('Invalid token. Please log in again', 401)

const handleJWTexpiredError = err => new AppBaseError('Your token has expired Please log in again', 401)
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status : err.status,
		error: err,
		message: err.message,
		stack: err.stack
	})
}

const sendErrorProd = (err, res) => {
	// Operational, trusted error: send message to client
	if(err.isOperational) {
		res.status(err.statusCode).json({
			status : err.status,
			message: err.message	
		})
	}
	// Programming or other unknown error: don't leak error details
	else {
		// 1) Log error
		console.error('ERROR ', err)
		// 2) Send generic message
		res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!'
		})
	}
}

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500
	err.status = err.status || 'error'
	if(process.env.NODE_ENV === 'development') {

		sendErrorDev(err, res)
	}
	else if (process.env.NODE_ENV === 'production') {
		let error = {...err}
		if(error.name === 'CastError') error =  handleCastErrorDB(error) 
		if(error.code === 11000) error = handleDuplicateFieldsDB(error)
		if(error.name === 'JsonWebTokenError') error = handleJWTerror(error)
		if(error.name === 'TokenExpiredError') error = handleJWTexpiredError(error)
		sendErrorProd(error, res)
		
	}
}