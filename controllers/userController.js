const { validationResult } = require('express-validator')
const { User } = require('../models/userModel')

const UserProfileGet = (req, res, next)=>{
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()){
        const error = new Error('Provide ID for fetching the user')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }
    const userName = req.query.id
    User.findOne({where:{userName:userName}, attributes:['emailId', 'userName', 'userId']}).then((result)=>{
        if(!result){
            const error = new Error('User Name does not exists')
            error.statusCode = 422
            throw error
        }
        res.status(200).json({data:result})
    }).catch((err)=>{
        next(err)
    })
}

module.exports = {
    UserProfileGet
}