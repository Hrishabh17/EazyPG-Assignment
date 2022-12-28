const { validationResult } = require('express-validator')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const { Post } = require('../models/postModel')
const { createIfKeyNotExists, Keyword } = require('../models/keywordsModel')
const { KeyPost } = require('../models/keyPostModel')
const { User } = require('../models/userModel')

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

    let postId;
   
    Post.create({
        title:title,
        summary:summary,
        content:content,
        category:category,
        authorId:req.userId,
        published:1
    }).then((result)=>{
        postId = result.postId
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

    Post.findAll({
                where:{postId:postId}, attributes:{exclude:['authorId']
        }, 
        include:[
            {
                model:Keyword, 
                attributes:['key'], 
                through:{attributes:[]}
            }, 
            {
                model:User,
                as:'Author',
                attributes:[['userName', 'authorName'], ['emailId', 'authorEmail'], ['userId', 'authorId']],
                
            }
        ]
    }).then((result)=>{

        if(result.length === 0){
            console.log('res')
            const error = new Error('Post does not exists')
            error.statusCode = 422
            throw error
        }

        res.status(200).json({data:{post:result}})
    }).catch((err)=>{
        next(err)
    })
}

const deletePost = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Please Check Post Data')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }

    const postId = req.query.id

    Post.destroy({where:{postId:postId}}).then(()=>{
        res.status(200).json({message:'Post successfully deleted'})
    }).catch((err)=>{
        next(err)
    })
}

const updatePost = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Please Check Post Data')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }

    const { postId } = req.body

    let updateVal = {};

    Object.entries(req.body).map((data)=>{
        if(data[0]!=='postId'){
            updateVal[data[0]] = data[1]
        }
    })
    console.log(updateVal)

    Post.update(updateVal, {where:{postId:postId}}).then(()=>{
        res.status(201).json({message:'Post updated successfully'})
    }).catch((err)=>{
        next(err)
    })
}

module.exports = {
    createPost, 
    fetchPostById,
    deletePost,
    updatePost
}