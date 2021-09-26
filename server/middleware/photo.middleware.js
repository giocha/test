require('module-alias/register')

const upload = require('@controllers/photo.controller')

const uploadProductPhoto = upload.single('photo')

module.exports = uploadProductPhoto