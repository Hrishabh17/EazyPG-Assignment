const router = require('express').Router()
const { body } = require('express-validator')
const { signUpPost, loginPost } = require('../controllers/authController')
const { checkUserNameAlreadyExists, checkEmailAlreadyExists } = require('../models/userModel')

router.post('/signup',[
    body('emailId')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .custom((email, {req})=>{
        return checkEmailAlreadyExists(email).then((res)=>{
            if(res){
                return Promise.reject('Email ID already exists')
            }
        })
    })
    .normalizeEmail(),

    body('userName').trim()
    .not().isEmpty()
    .isLength({min: 5})
    .withMessage('Enter a valid username with minimum 5 characters')
    .custom((userName, {req})=>{
        return checkUserNameAlreadyExists(userName).then((res)=>{
            if(res){
                return Promise.reject('User Name already exists')
            }
        })
    }),

    body('password').trim()
    .isStrongPassword({minLength:8, minSymbols:1, minUppercase:1, minNumbers:1})
    .withMessage('Enter Valid Password with minLength: 8, uppercase and symbol')

], signUpPost)

router.post('/login',[    
    body('userName').trim()
    .not().isEmpty(),

    body('password').trim()
    .not().isEmpty()

], loginPost)


module.exports = router