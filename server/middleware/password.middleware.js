require('module-alias/register')
const crypto = require('crypto')
const User = require('@models/user.model')
const asyncCatch = require('@utils/asyncError.util')
const AppBaseError = require('@utils/appError.util')
const Email = require('@utils/email.util')
const {createSendToken, signToken } = require('@utils/token.util')


const forgotPassword = asyncCatch ( async (req, res, next) => {
	const user = await User.findOne({ email : req.body.email})
	if(!user) {
		return next(new AppBaseError('There is no user with that email address.', 404))
	}
	const resetToken = user.createPasswordResetToken()
	console.log('to reset token einai : ', resetToken)
	console.log('to reset token einai : ', req.protocol)
	console.log('to reset token einai : ', req.get('host'))
	console.log('to reset token einai : ', user)
	
	await user.save({validateBeforeSave : false})
	// const message = `Forgot your password ? Submit a PATCH request with your new password and passwordConfirm to : ${resetURL}.
	// If you didn't forget your password, please ignore this email.`
	try {
		// await Email({
			// 	email : user.email,
			// 	subject : 'Your password reset token ( valid for 10 minutes )',
			// 	message
			// })
		const resetURL = `${req.protocol}://${req.get('host')}/vineyards/users/resetPassword/${resetToken}`
		await new Email(user, resetURL).sendPasswordReset()
		res.status(200).json({
			status : 'success',
			message : 'Token sent to email'
		})
	}
	catch (err) {
		user.PasswordResetToken = undefined
		user.passwordResetExpires = undefined
		await user.save({validateBeforeSave : false})
		return next(new AppBaseError('There was an error sending the email. Try again later', 500))
	}
})


const resetPassword = asyncCatch ( async ( req, res, next) => {
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
	const user = await User.findOne({passwordResetToken : hashedToken, passwordResetExpires : {$gt : Date.now()}})
	if(!user) {
		return next(new AppBaseError('Token is invalid or has expired. ', 400))
	}
	user.password = req.body.password
	user.passwordConfirm = req.body.passwordConfirm
	user.passwordResetToken = undefined
	user.passwordResetExpires = undefined
	await user.save()
	createSendToken(user, 200, res)
})

const updatePassword = asyncCatch( async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password')
	if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
		return next(new AppBaseError('Your current password is wrong.',401))
	}
	user.password = req.body.password
	user.passwordConfirm = req.body.passwordConfirm
	await user.save()
	createSendToken(user, 200, res)
})


module.exports = { forgotPassword, resetPassword, updatePassword}