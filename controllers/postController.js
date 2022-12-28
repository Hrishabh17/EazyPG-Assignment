const { validationResult } = require('express-validator')
const dotenv = require('dotenv')
const { Post } = require('../models/postModel')
const { createIfKeyNotExists, Keyword } = require('../models/keywordsModel')
const { KeyPost } = require('../models/keyPostModel')
const { User } = require('../models/userModel')
const { Comment } = require('../models/commentsModel')
const { Like } = require('../models/likeModel')
const { Sequelize, Op } = require('sequelize')

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
        if(!err.statusCode){
            err.statusCode = 500
            err.message= 'Not allowed! Check Headers and Body Again'
        }
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

    const postId = req.params.postId

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
        if(!err.statusCode){
            err.statusCode = 500
            err.message= 'Not allowed! Check Headers and Body Again'
        }
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

    const postId = req.params.postId

    Post.destroy({where:{postId:postId}}).then(()=>{
        res.status(200).json({message:'Post successfully deleted'})
    }).catch((err)=>{
        if(!err.statusCode){
            err.statusCode = 500
            err.message= 'Not allowed! Check Headers and Body Again'
        }
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

    const postId  = req.params.postId

    let updateVal = {};

    Object.entries(req.body).map((data)=>{
        updateVal[data[0]] = data[1]
    })

    Post.update(updateVal, {where:{postId:postId}}).then(()=>{
        res.status(201).json({message:'Post updated successfully'})
    }).catch((err)=>{
        if(!err.statusCode){
            err.statusCode = 500
            err.message= 'Not allowed! Check Headers and Body Again'
        }
        next(err)
    })
}

const getPostsWithFilters = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Please Check Post Data')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }

    let filterby = {};
    let orderby = ['updatedAt']

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = parseInt(req.query.offset) || (page-1)*limit

    Object.entries(req.query).map((data)=>{
        
        if(data[0]==='mostLike'){
            orderby.push('numLikes')
        }
        else if(data[0]==='mostComment'){
            orderby.push('numComments')
        }
        else if(data[0] === 'keywords'){
            filterby['$Keywords.key$'] = { [Op.in]:data[1] }
        }
        else if(data[0]==='content'){
            filterby.content = {[Op.like]:`%${data[1]}%`}
        }
        else if(data[0]==='category' || data[0]==='authorId'){
            filterby[data[0]] = data[1]
        }
    })

    console.log(filterby)
    console.log(orderby)


    Post.findAll({
        subQuery:false,
        attributes:{
            include:[
                [Sequelize.fn('COUNT', Sequelize.col('Likes.postId')), 'numLikes'],
                [Sequelize.fn('COUNT', Sequelize.col('Comments.postId')), 'numComments']
            ],
            exclude:['Post_Keywords.postId']
        },
        where:filterby,
        include:[
            {
                model:User,
                as:'Author',
                attributes:[
                    ['userName', 'authorName'], 
                    ['emailId', 'authorEmail']
                ],
            },
            {
                model:Keyword,
                attributes:[],
                through:{
                    attributes:[]
                },
            },
            {
                model:Comment,
                attributes:[
                    ['content', 'comment'],
                    ['userId', 'commentorId']
                ]
            },
            {
                model:Like,
                attributes:[]
            },
            {
                model:Post,
                attributes:['postId'],
                as:'Post_Keywords',
                include:[
                    {
                        model:Keyword,
                        attributes:['key'],
                        through:{
                            attributes:[]
                        }
                    }
                ],
            }
        ],
        group:['Post.postId', 'Author.userId', 'Keywords.keyId', 'Comments.commentId', 'Likes.LikeId', 'Keywords.KeyPost.keyPostId','Post_Keywords.postId',  'Post_Keywords.Keywords.keyId'],
        order:orderby,
        limit:limit,
        offset:offset
    })
    .then((result)=>{
        res.status(200).json({data:result})
    }).catch((err)=>{
        console.log(err)
        err.statusCode = 500
        err.message = 'Something went wrong! Try Again'
        next(err)
    })


}

module.exports = {
    createPost, 
    fetchPostById,
    deletePost,
    updatePost, 
    getPostsWithFilters
}