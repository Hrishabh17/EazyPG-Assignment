const { validationResult } = require('express-validator')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const { Post } = require('../models/postModel')
const { createIfKeyNotExists, Keyword } = require('../models/keywordsModel')
const { KeyPost } = require('../models/keyPostModel')

dotenv.config()

const createPost = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Please Check Post Data')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }
    const {title, summary, content, category, keywords} = req.body

    const uid = Math.floor(Math.random() * 16589).toString()
    const normalId = title + uid
    let postId;

    bcrypt.hash(normalId, parseInt(process.env.USERNAME_ENCRYPT_LEN)).then((postIdHashed)=>{
        postId = postIdHashed
        Post.create({
            postId:postIdHashed,
            title:title,
            summary:summary,
            content:content,
            category:category,
            authorId:req.userId,
            published:1
        })
    }).then(()=>{
        keywords.map((key)=>{
            createIfKeyNotExists(key, next).then((res)=>{
                KeyPost.create({keyId:res[0].dataValues.keyId, postId:postId})
            })
        })
    }).then(()=>{
        res.status(201).json({message:'Post created successfully', data:{postId:postId}})
    }).catch((err)=>{
        next(err)
    })
}

const fetchPostById = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Please Check Post Data')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }

    const postId = req.query.id

    Post.findAll({where:{postId:postId}, include:[{model:Keyword, attributes:['key'], through:{attributes:[]}}]}).then((result)=>{
        res.status(200).json({data:{post:result}})
    }).catch((err)=>{
        next(err)
    })
}

module.exports = {
    createPost, 
    fetchPostById
}