require('module-alias/register')

const express = require('express')
const {
	getAllUsers,
	getUser,
	updateUser,
	deleteUser,
	updateMe,
	deleteMe,
	getMe
} = require('@controllers/user.controller')

const {
	signup,
	login,
	logout,
	isLoggedIn
} = require('@controllers/auth.controller')

const {
	forgotPassword,
	resetPassword,
	updatePassword,
} = require('@middleware/password.middleware')


const {
	protect,
	restrictTo
} = require('@middleware/role.middleware')



const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword/:token', resetPassword)
// ! router.get('/dokimi', isLoggedIn) NA TO TESTARW 

router.use(protect) // prepei na einai member apo edw kai katw

router.patch('/updateMyPassword', updatePassword)
router.get('/me', getMe, getUser)
router.patch('/updateMe', updateMe)
router.delete('/deleteMe', deleteMe)

router.use(restrictTo('admin')) // mono o admin exei dikaiwmata

router.route('/').get(getAllUsers) // createUser ? o admin.. isws prepei na to dw
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router