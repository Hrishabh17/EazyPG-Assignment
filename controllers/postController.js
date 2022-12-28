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
        const post = new Post({
            postId:postIdHashed,
            title:title,
            summary:summary,
            content:content,
            category:category,
            authorId:req.userId,
            published:1
        })
        postId = postIdHashed
        post.save()
    }).then(()=>{
        keywords.map((key)=>{
            createIfKeyNotExists(key, next).then((res)=>{
                const keySave = new KeyPost({keyId:res.dataValues.keyId, postId:postId})
                keySave.save()

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

    // const postRes = await Post.findByPk(postId)

    // const keyPostRes = await postRes.getKeywords()

    let keywords = [];
    let Posts;
    Post.findByPk(postId).then((post)=>{
        Posts = post
        return post.getKeywords()
    }).then((keys)=>{
        keys.map(({dataValues})=>{
            keywords.push(dataValues.key)
        })
    }).then(()=>{
        Posts.keywords = keywords
        res.status(200).json({data:{post:Posts, keywords:keywords}})
    })

    // console.log(keyPostRes[0].dataValues.key)
    
}

module.exports = {
    createPost, 
    fetchPostById
}