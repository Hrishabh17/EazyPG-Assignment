const router = require('express').Router()
const { query, body } = require('express-validator')
const { createPost, fetchPostById, deletePost, updatePost } = require('../controllers/postController')

const verifyToken = require('../middlewares/jwtCheck')
const { PostAlreadyExistsByTitle, PostAlreadyExistsById, PostAlreadyExistsByTitleId, isAuthenticatedToDelete } = require('../models/postModel')

router.post('/', verifyToken, [
    body('title').trim()
    .not().isEmpty()
    .withMessage('Provide title for the Post')
    .custom((title, {req})=>{
        return PostAlreadyExistsByTitle(title).then((result)=>{
            if(result){
                return Promise.reject('Post with same title exists')
            }
        })
    }),

    body('summary').trim()
    .not().isEmpty()
    .withMessage('Provide summary for the Post'),

    body('content').trim()
    .not().isEmpty()
    .withMessage('Provide content for the Post'),

    body('category').trim()
    .not().isEmpty()
    .withMessage('Provide category for the Post'),

    body('keywords').isArray({max:5})
    .withMessage('Provide max 5 Keyword as an array for the Post')
    
], createPost)

router.get('/', [
    query('id').trim()
    .not().isEmpty()
    .isUUID()
    .withMessage('Enter a valid id to fetch data')

], fetchPostById)

router.delete('/', verifyToken, [
    query('id').trim()
    .not().isEmpty()
    .isUUID()
    .withMessage('Enter a valid post id')
    .custom((id, {req})=>{
        return PostAlreadyExistsById(id).then((result)=>{
            if(!result){
                return Promise.reject('Post with given Id does not exists')
            }
        })
    })
    .custom((id, {req})=>{
        return isAuthenticatedToDelete(id, req.userId).then((result)=>{
            if(!result){
                return Promise.reject('Not Authenticated to Delete')
            }
        })
    })

], deletePost)

router.put('/', verifyToken, [

    body().custom(body => {
        const keys = ['postId', 'title', 'summary', 'category', 'keywords', 'content'];
        return Object.keys(body).every(key => keys.includes(key));
    })
    .withMessage('Some extra parameters are sent'),

    body('postId').trim()
    .not().isEmpty()
    .withMessage('Provide a Post Id')
    .isUUID().withMessage('Provide a valid Post Id')
    .custom((postId, {req})=>{
        return PostAlreadyExistsById(postId).then((result)=>{
            if(!result){
                return Promise.reject('Post with given Id does not exists')
            }
        })
    })
    .custom((id, {req})=>{
        return isAuthenticatedToDelete(id, req.userId).then((result)=>{
            if(!result){
                return Promise.reject('Not Authenticated to Update')
            }
        })
    }),

    body('title').optional()
    .trim()
    .not().isEmpty()
    .withMessage('Provide a valid Title')
    .custom((title, {req})=>{
        return PostAlreadyExistsByTitleId(title, req.body.postId).then((result)=>{
            if(result){
                return Promise.reject('Post with same title exists')
            }
        })
    }),

    body('summary').optional()
    .trim()
    .not().isEmpty()
    .withMessage('Provide summary for the Post'),

    body('content').optional()
    .trim()
    .not().isEmpty()
    .withMessage('Provide content for the Post'),

    body('category').optional()
    .trim()
    .not().isEmpty()
    .withMessage('Provide category for the Post'),

    body('keywords').optional()
    .isArray({max:5})
    .withMessage('Provide max 5 Keyword as an array for the Post')

], updatePost)

module.exports = router