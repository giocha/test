require('module-alias/register')

const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const AppBaseError = require('@utils/appError.util')
const globalErrorHandler = require('@controllers/globalError.controller')

const app = express()
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
// const hpp = require('hpp') - *
// const cookieParser = require('cookie-parser');
const cors = require('cors')
const userRouter = require('@routes/user.routes')
const productRouter = require('@routes/product.routes')

app.use(helmet())
if( process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

const limiter = rateLimit({
	max : 100,
	windowMs : 60 * 60 * 1000,
	message : 'Too many requests from this IP, please try again in an hour'
})

app.use('vineyards', limiter)
app.use(express.json())
app.use(cors())
app.use(mongoSanitize())
app.use(xss())
/*
app.use(hpp({ whiteList : [''] }))
*/
app.use(express.static(`${__dirname}/client`)) // ? NOT NEEDED ? 
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString()
	next()
})

app.use('/vineyards/users', userRouter)
app.use('/vineyards/products', productRouter)
app.all('*', (req, res, next) => {
	next(new AppBaseError(`Can not find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler)



module.exports = app




//  o admin exei problima sto restrictTo ... mporei na to allaksei o user apo to broweser req.body ***