const router = require('express').Router()
const { query } = require('express-validator')
const { UserProfileGet } = require('../controllers/userController')

router.get('/', [
    query('id').trim()
    .not().isEmpty()
    .withMessage('Provide User Name for fetching the profile')

], UserProfileGet)

module.exports = router