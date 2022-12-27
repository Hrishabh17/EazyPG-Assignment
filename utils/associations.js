const sequelize = require('./database')
const { User } = require('../models/userModel')
const { Post } = require('../models/postModel')
const { Like } = require('../models/likeModel')
const { Comment } = require('../models/commentsModel')

const createAssociations = ()=>{
    createPostUserAssociation(),
    createCommentAssociations()
    createLiketAssociations()
}

const createPostUserAssociation = ()=>{
    User.hasMany(Post, {foreignKey: 'authorId'})
}

const createCommentAssociations = ()=>{
    User.hasMany(Comment, {foreignKey: 'userId'})
    Post.hasMany(Comment, {foreignKey: 'postId'})
}

const createLiketAssociations = ()=>{
    User.hasMany(Like, {foreignKey: 'userId'})
    Post.hasMany(Like, {foreignKey: 'postId'})
}


module.exports = createAssociations