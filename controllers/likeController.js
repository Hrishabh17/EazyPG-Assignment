const { validationResult } = require('express-validator')
const { Like } = require('../models/likeModel')

const likePost = (req, res, next)=>{
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()){
        const error = new Error('Provide Post Id and Content for creating the Comment')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }
    const {postId} = req.body
    Like.create({
        postId:postId,
        userId:req.userId
    }).then(()=>{
        res.status(200).json({message:'Liked Successfully'})
    })
}

const unlikePost = (req, res, next)=>{
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()){
        const error = new Error('Provide Post Id and Content for creating the Comment')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }

    const {postId} = req.body
    Like.destroy({where:{postId:postId, userId:req.userId}}).then(()=>{
        res.status(200).json({message:'Unliked Successfully'})
    })
}

module.exports = {
    likePost,
    unlikePost
}