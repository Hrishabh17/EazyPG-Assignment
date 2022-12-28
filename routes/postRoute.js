const router = require('express').Router()
const { query, body } = require('express-validator')
const { createPost, fetchPostById } = require('../controllers/postController')

const verifyToken = require('../middlewares/jwtCheck')
const { PostAlreadyExists } = require('../models/postModel')

router.post('/', [
    body('title').trim()
    .not().isEmpty()
    .withMessage('Provide title for the Post')
    .custom((title, {req})=>{
        return PostAlreadyExists(title).then((result)=>{
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

    body('keywords').isArray()
    .withMessage('Provide Keyword as an array for the Post')
    
], verifyToken, createPost)

router.get('/', [
    query('id').trim()
    .not().isEmpty()
    .withMessage('Enter a valid id to fetch data')

], fetchPostById)

module.exports = router