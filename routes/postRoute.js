const router = require('express').Router()
const { query, body, param } = require('express-validator')
const { createPost, fetchPostById, deletePost, updatePost, getPostsWithFilters } = require('../controllers/postController')

const verifyToken = require('../middlewares/jwtCheck')
const { PostAlreadyExistsByTitle, PostAlreadyExistsById, PostAlreadyExistsByTitleId, isAuthenticatedToDelete } = require('../models/postModel')
const { checkUserIdAlreadyExists } = require('../models/userModel')

router.get('/',[
    query().custom(query => {
        const keys = ['keywords', 'content', 'category', 'authorId','limit', 'offset', 'page', 'mostLike', 'mostComment', 'mostRecent'];
        return Object.keys(query).every(key => keys.includes(key));
    })
    .withMessage('Extra query params not allowed'),

    query('content').optional()
    .trim()
    .isLength({max:10})
    .withMessage('content search query should have max length 10'),

    query('keywords').optional()
    .isArray()
    .withMessage('keywords query should be an array with max 5 keywords'),

    query('authorId').optional()
    .isUUID()
    .withMessage('authorId query should be an UUID'),
    
    query('category').optional()
    .trim()
    .not().isEmpty()
    .withMessage('category query should not be empty'),

    query('mostLike').optional()
    .trim()
    .not().isEmpty()
    .isBoolean()
    .withMessage('mostLike query should be a boolean'),

    query('mostComment').optional()
    .trim()
    .not().isEmpty()
    .isBoolean()
    .withMessage('mostLike query should be a boolean'),

    query('mostRecent').optional()
    .trim()
    .not().isEmpty()
    .isBoolean()
    .withMessage('mostLike query should be a boolean'),

    query('page').optional()
    .trim()
    .not().isEmpty()
    .isNumeric()
    .withMessage('page query should be a number'),

    query('limit').optional()
    .trim()
    .not().isEmpty()
    .isNumeric()
    .withMessage('limit query should be a number'),

    query('offset').optional()
    .trim()
    .not().isEmpty()
    .isNumeric()
    .withMessage('offset query should be a number')

], getPostsWithFilters)

router.post('/', verifyToken, [
    body('title').trim()
    .not().isEmpty()
    .withMessage('Provide title for the Post')
    .custom((title, {req})=>{
        return PostAlreadyExistsByTitle(title).then((result)=>{
            if(result){
                return Promise.reject('Post with same title exists')
            }
        }).then(()=>{
            return checkUserIdAlreadyExists(req.userId).then((result)=>{
                if(!result){
                    return Promise.reject('User does not exists')
                }
            })
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

router.get('/:postId', [
    param('postId').trim()
    .not().isEmpty()
    .isUUID()
    .withMessage('Enter a valid id to fetch data')

], fetchPostById)

router.delete('/:postId', verifyToken, [
    param('postId').trim()
    .not().isEmpty()
    .isUUID()
    .withMessage('Enter a valid post id')
    .custom((id, {req})=>{
        return PostAlreadyExistsById(id).then((result)=>{
            if(!result){
                return Promise.reject('Post with given Id does not exists')
            }
        }).then(()=>{
            return isAuthenticatedToDelete(id, req.userId).then((result)=>{
                if(!result){
                    return Promise.reject('Not Authenticated to Delete')
                }
            })
        })
    })

], deletePost)

router.put('/:postId', verifyToken, [

    body().custom(body => {
        const keys = ['title', 'summary', 'category', 'keywords', 'content'];
        return Object.keys(body).every(key => keys.includes(key));
    })
    .withMessage('Some extra parameters are sent'),

    param('postId').trim()
    .not().isEmpty()
    .withMessage('Provide a Post Id')
    .isUUID().withMessage('Provide a valid Post Id')
    .custom((id, {req})=>{
        return PostAlreadyExistsById(id).then((result)=>{
            if(!result){
                return Promise.reject('Post with given Id does not exists')
            }
        }).then(()=>{
            return isAuthenticatedToDelete(id, req.userId).then((result)=>{
                if(!result){
                    return Promise.reject('Not Authenticated to Update')
                }
            })
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