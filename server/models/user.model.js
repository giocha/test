require('module-alias/register')
const mongoose = require('mongoose')
const validator = require('validator')
const { correctPassword, changedPasswordAfter, createPasswordResetToken } = require('@utils/userSchema.util')
const { preSave_hashPass, preSave_ChangedAt, preFind} = require('@middleware/userSchema.middleware')
/*
username	password		date of birth
first		zip code 		city
last		phone			email	
address		mobile phone
		
*/

const userSchema = new mongoose.Schema({
	userName : {
		type : String,
		required : [true, 'Please provide a username.'],
		unique : true,
		trim : true,
		lowercase : true,
		minLength : [2, 'At least two characters are valid.'],
		maxLength : [25, 'Maximum 25 characters are allowed'],
		 
	},
	firstName : {
		type : String,
		uppercase : true,
		required : [true, 'Please inform your profile with your first name!'],
		minLength : [2, 'At least two characters are valid.'],
		maxLength : [25, 'Maximum 25 characters are allowed'],
		validate : [validator.isAlpha, 'Only A-Z characters are allowed.']
		
	},
	lastName : {
		type : String,
		uppercase : true,
		required : [true, 'Please inform your profile with your last name!'],
		minLength : [2, 'At least two characters are valid.'],
		maxLength : [25, 'Maximum 25 characters are allowed'],
		validate : [validator.isAlpha, 'Only A-Z characters are allowed.']
	},
	dateOfBirth : {
		type : Date,
		validate : [validator.isDate, 'Please provide your date of birth']
	},
	email : {
		type : String,
		required : [true, 'Please provide your email.'],
		unique : true,
		lowercase : true,
		validate : [validator.isEmail, 'This is not a valid email. Check your spelling!']
	},
	country : {
		type : String,
		enum : ['GREECE', 'ITALY', 'SPAIN'],
		default : 'Greece',
		uppercase : true
	},
	city : {
		type : String,
		validate : [validator.isAlpha, 'Only A-Z characters are allowed.'],
		uppercase : true
	},
	address : {
		type : String,
		validate : {
			validator : function(str) {
				if (!validator.isAlphanumeric(validator.blacklist(str, ' '))) {
					throw new Error('Only a-z,A-Z,0-9');
				  }
				
			},
			message : 'Only letters and numbers (a-zA-Z0-9) are allowed.'
		} ,
		// [validator.matches(/^[a-z0-9 ]+$/i), 'Only letters and numbers (a-zA-Z0-9) are allowed.'],
		uppercase : true
	},
	zipCode : {
		type : String,
		validate : [validator.isInt, 'Only numbers are allowed.']
	},
	phone : {
		type : String,
		validate : [validator.isInt, 'Only numbers are allowed.']
	},
	mobilePhone : {
		type : String,
		validate : [validator.isInt, 'Only numbers are allowed.']
	},
	password : {
		type : String,
		required : [true, 'Please provide a password.'],
		minLength : 8,
		select : false
	},
	passwordConfirm : {
		type : String,
		required : [true, 'Please confirm your password.'],
		validate : {
			validator : function(el) {
				return el === this.password 		// * 
			}
		}
	},
	role : {
		type : String,
		enum : ['user', 'admin'],
		default : 'user',
		// select : false
	},
	passwordChangedAt : Date,
	passwordRestToken : String,
	passwordResetExpires : Date,
	active : {
		type : Boolean,
		default : true,
		select : false
	}
})



userSchema.pre('save', preSave_hashPass)
userSchema.pre('save', preSave_ChangedAt)
userSchema.pre(/^find/, preFind)

userSchema.methods.correctPassword = correctPassword
userSchema.methods.changedPasswordAfter = changedPasswordAfter
userSchema.methods.createPasswordResetToken = createPasswordResetToken


const User = mongoose.model('User', userSchema)

module.exports = User