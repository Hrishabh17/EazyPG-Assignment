const router = require('express').Router()
const { body, param } = require('express-validator')
const { createComment, updateComment, deleteComment, getComment, getAllComments } = require('../controllers/commentController')
const verifyToken = require('../middlewares/jwtCheck')
const { commentExists, isAuthenticatedUser } = require('../models/commentsModel')
const { PostAlreadyExistsById } = require('../models/postModel')


router.get('/', getAllComments)

router.get('/:commentId', [
    param('commentId').exists().withMessage('Provide Comment Id')
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
    body('postId').exists().trim()
    .isUUID().withMessage('Provide valid Post Id')
    .custom((postId, {req})=>{
        return PostAlreadyExistsById(postId).then((result)=>{
            if(!result){
                return Promise.reject('Post with given Id does not exists')
            }
        }) 
    }),

    body('content').exists().trim()
    .not().isEmpty()
    .withMessage('Provide Comment Content for creating the comment')

], createComment)

router.put('/:commentId', verifyToken, [
    param('commentId').exists().withMessage('Provide Comment Id')
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

    body('content').exists().trim()
    .not().isEmpty()
    .withMessage('Provide Comment Content for updating the comment')

], updateComment)

router.delete('/:commentId', verifyToken, [
    param('commentId').exists().withMessage('Provide Comment Id')
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