const router = require('express').Router()
const { body } = require('express-validator')
const { createComment, updateComment, deleteComment, getComment } = require('../controllers/commentController')
const verifyToken = require('../middlewares/jwtCheck')
const { commentExists, isAuthenticatedUser } = require('../models/commentsModel')
const { PostAlreadyExistsById } = require('../models/postModel')

router.get('/', [
    body('commentId').exists().withMessage('Provide Comment Id')
    .trim()
    .isUUID().withMessage('Provide valid Comment Id')
    .custom((commentId, {req})=>{
        return commentExists(commentId).then((result)=>{
            if(!result){
                return Promise.reject('Comment with given id does not exists')
            }
        }) 
    })

], getComment)

router.post('/', verifyToken, [
    body('postId').trim().exists()
    .isUUID().withMessage('Provide valid Post Id')
    .custom((postId, {req})=>{
        return PostAlreadyExistsById(postId).then((result)=>{
            if(!result){
                return Promise.reject('Post with given Id does not exists')
            }
        }) 
    }),

    body('content').trim().exists()
    .not().isEmpty()
    .withMessage('Provide Comment Content for creating the comment')

], createComment)

router.put('/', verifyToken, [
    body('commentId').exists().withMessage('Provide Comment Id')
    .trim()
    .isUUID().withMessage('Provide valid Comment Id')
    .custom((commentId, {req})=>{
        return commentExists(commentId).then((result)=>{
            if(!result){
                return Promise.reject('Comment with given id does not exists')
            }
        }).then(()=>{
            return isAuthenticatedUser(commentId, req.userId).then((result)=>{
                if(!result){
                    return Promise.reject('Not authentiated to Update comment')
                }
            }) 
        }) 
    }),

    body('content').trim().exists()
    .not().isEmpty()
    .withMessage('Provide Comment Content for updating the comment')

], updateComment)

router.delete('/', verifyToken, [
    body('commentId').exists().withMessage('Provide Comment Id')
    .trim()
    .isUUID().withMessage('Provide valid Comment Id')
    .custom((commentId, {req})=>{
        return commentExists(commentId).then((result)=>{
            if(!result){
                return Promise.reject('Comment with given id does not exists')
            }
        }).then(()=>{
            return isAuthenticatedUser(commentId, req.userId).then((result)=>{
                if(!result){
                    return Promise.reject('Not authentiated to Delete comment')
                }
            })
        }) 
    })

], deleteComment)

module.exports = router