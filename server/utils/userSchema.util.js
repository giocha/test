const crypto = require('crypto')
const bcrypt = require('bcryptjs')


const correctPassword = async function(candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword)
}

const changedPasswordAfter = function(JWTTimestamp) {
	if(this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
		console.log(this.passwordChangedAt.getTime()/1000, JWTTimestamp)
		return JWTTimestamp < changedTimestamp
	}
	return false
}

const createPasswordResetToken = function() {
	const resetToken = crypto.randomBytes(32).toString('hex')
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	console.log({resetToken}, this.passwordResetToken)
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000
	return resetToken
}


module.exports = { correctPassword, changedPasswordAfter, createPasswordResetToken}