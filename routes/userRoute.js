const router = require('express').Router()
const { param } = require('express-validator')
const { UserProfileGet } = require('../controllers/userController')

router.get('/:id', [
    param('id').trim()
    .not().isEmpty()
    .withMessage('Provide User Name for fetching the profile')

], UserProfileGet)

module.exports = router