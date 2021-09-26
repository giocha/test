const bcrypt = require('bcryptjs')

const preSave_hashPass = async function(next) {
	if ( !this.isModified('password')) return next()
	this.password = await bcrypt.hash(this.password, 12)
	this.passwordConfirm = undefined
	next()
}
const preSave_ChangedAt = function(next) {
	if(!this.isModified('password') || this.isNew) return next()
	this.passwordChangedAt = Date.now() - 1000
	next()
}

const preFind = function (next) {
	this.find({active : {$ne : false}})
	next()
}

module.exports = { preSave_hashPass, preSave_ChangedAt, preFind}