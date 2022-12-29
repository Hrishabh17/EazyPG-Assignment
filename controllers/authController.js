const { User } = require('../models/userModel')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const signUpPost = (req, res, next)=>{
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()){
        const error = new Error('New User could not be created')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }
    const { emailId, userName, password } = req.body

    bcrypt.hash(password, parseInt(process.env.PASSWORD_ENCRYPT_LEN)).then((hashedPassword)=>{
        return User.create({
                emailId:emailId,
                userName:userName,
                password:hashedPassword,
            })
    }).then(()=>{
        res.status(201).json({message:'User Successfully created'})
    }).catch((err)=>{
        if(!err.statusCode){
            err.statusCode = 500
            err.message= 'Not allowed! Check Headers and Body Again'
        }
        next(err)
    })
}

const loginPost = (req, res, next)=>{
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()){
        const error = new Error('New User could not be created')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }
    const { userName, password } = req.body

    User.findOne({where:{userName:userName}, attributes:['password', 'userName', 'userId']}).then((result)=>{
        if(!result){
            const error = new Error('User Name does not exists')
            error.statusCode = 422
            throw error
        }

        bcrypt.compare(password, result.password).then((isEqual)=>{
            if(!isEqual){
                const error = new Error('Authentication Failed')
                error.statusCode = 401
                throw error
            }
            else{
                const token  = jwt.sign({
                    userName:result.userName,
                    userId:result.userId
                }, process.env.JWT_KEY, {expiresIn: '2h'})

                res.status(200).json({message:'Authentication Successful', data:{JWT:token}})
            }
        }).catch((err)=>{
            if(!err.statusCode){
                err.statusCode = 500
                err.message= 'Not allowed! Check Headers and Body Again'
            }
            next(err)
        })

    }).catch((err)=>{
        if(!err.statusCode){
            err.statusCode = 500
            err.message= 'Not allowed! Check Headers and Body Again'
        }
        next(err)
    })
}

module.exports = {
    signUpPost, 
    loginPost
}