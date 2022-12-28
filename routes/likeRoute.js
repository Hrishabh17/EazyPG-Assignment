const router = require('express').Router()
const { body } = require('express-validator')
const { likePost, unlikePost } = require('../controllers/likeController')
const verifyToken = require('../middlewares/jwtCheck')
const { PostAlreadyExistsById } = require('../models/postModel')

router.post('/like', verifyToken, [
    body('postId')
    .trim()
    .isUUID()
    .not().isEmpty()
    .withMessage('Provide post Id to like')
    .custom((postId, {req})=>{
        return PostAlreadyExistsById(postId).then((result)=>{
            if(!result){
                return Promise.reject('Post with given Id does not exists')
            }
        })
    })

], likePost)

router.post('/unlike', verifyToken, [
    body('postId')
    .trim()
    .isUUID()
    .not().isEmpty()
    .withMessage('Provide post Id to like')
    .custom((postId, {req})=>{
        return PostAlreadyExistsById(postId).then((result)=>{
            if(!result){
                return Promise.reject('Post with given Id does not exists')
            }
        })
    })

], unlikePost)

module.exports = router