const router = require('express').Router()
const { body } = require('express-validator')
const { likePost, unlikePost } = require('../controllers/likeController')
const verifyToken = require('../middlewares/jwtCheck')
const { isAuthenticatedToUnLike } = require('../models/likeModel')
const { PostAlreadyExistsById, isAuthenticatedToDelete } = require('../models/postModel')

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
        }).then(()=>{
            return isAuthenticatedToDelete(postId, req.userId).then((result)=>{
                if(!result){
                    return Promise.reject('Not Authenticated to unlike')
                }
            }).then((delAuth)=>{
                if(!delAuth){
                    return isAuthenticatedToUnLike(postId, req.userId).then((result)=>{
                        if(result){
                            return Promise.reject('Already Liked')
                        }
                    })
                }
            })
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
        }).then(()=>{
            return isAuthenticatedToDelete(postId, req.userId).then((result)=>{
                if(!result){
                    return Promise.reject('Not Authenticated to unlike')
                }
            }).then((delAuth)=>{
                if(!delAuth){
                    return isAuthenticatedToUnLike(postId, req.userId).then((result)=>{
                        if(!result){
                            return Promise.reject('Already Unliked')
                        }
                    })
                }
            })
        })
    })

], unlikePost)

module.exports = router