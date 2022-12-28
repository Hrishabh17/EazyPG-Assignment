const { validationResult } = require('express-validator')
const { Comment } = require('../models/commentsModel')

const createComment = (req, res, next)=>{
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()){
        const error = new Error('Provide Post Id and Content for creating the Comment')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }

    const {postId, content} = req.body

    Comment.create({
        content:content,
        postId:postId,
        userId:req.userId
    }).then((result)=>{
        res.status(201).json({message:'Comment created successfully', data:{commentId:result.commentId}})
    }).catch((err)=>{
        next(err)
    })
}

const updateComment = (req, res, next)=>{
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()){
        const error = new Error('Provide Post Id and Content for creating the Comment')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }

    const commentId = req.params.commentId
    const {content} = req.body

    Comment.update({content:content},{where:{commentId:commentId, userId:req.userId}}).then(()=>{
        res.status(200).json({message:'Comment updated successfully'})
    }).catch((err)=>{
        next(err)
    })
}

const deleteComment = (req, res, next)=>{
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()){
        const error = new Error('Provide comment Id for deleting the Comment')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }

    const commentId = req.params.commentId

    Comment.destroy({where:{commentId:commentId, userId:req.userId}}).then(()=>{
        res.status(200).json({message:'Comment deleted successfully'})
    }).catch((err)=>{
        next(err)
    })
}

const getComment = (req, res, next)=>{
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()){
        const error = new Error('Provide comment Id to fetch')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }

    const commentId = req.params.commentId

    Comment.findOne({where:{commentId:commentId}, attributes:['commentId', 'content', 'postId']}).then((result)=>{
        res.status(200).json({data:{commentId: result}})
    }).catch((err)=>{
        next(err)
    })
}

const getAllComments = (req, res, next)=>{
    Comment.findAll().then((result)=>{
        res.status(200).json({data:result})
    }).catch((err)=>{
        err.statusCode = 500
        err.message = 'Something went wrong! Try Again'
        next(err)
    })
}

module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getComment, 
    getAllComments
}