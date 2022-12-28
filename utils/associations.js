const { User } = require('../models/userModel')
const { Post } = require('../models/postModel')
const { Like } = require('../models/likeModel')
const { Comment } = require('../models/commentsModel')
const { Keyword } = require('../models/keywordsModel')
const { KeyPost } = require('../models/keyPostModel')

const createAssociations = ()=>{
    createPostUserAssociation(),
    createCommentAssociation()
    createLiketAssociation(),
    createKeywordPostAssociation()
}

const createPostUserAssociation = ()=>{
    User.hasMany(Post, {foreignKey: 'authorId'})
    Post.belongsTo(User, {foreignKey: 'authorId'})
}

const createCommentAssociation = ()=>{
    User.hasMany(Comment, {foreignKey: 'userId'})
    Post.hasMany(Comment, {foreignKey: 'postId'})
    Comment.belongsTo(User, {foreignKey: 'userId'})
    Comment.belongsTo(Post, {foreignKey: 'postId'})
}

const createLiketAssociation = ()=>{
    User.hasMany(Like, {foreignKey: 'userId'})
    Post.hasMany(Like, {foreignKey: 'postId'})
    Like.belongsTo(User, {foreignKey: 'userId'})
    Like.belongsTo(Post, {foreignKey: 'postId'})
}

const createKeywordPostAssociation = ()=>{
    Post.belongsToMany(Keyword, {through: KeyPost, foreignKey:'postId'})
    Keyword.belongsToMany(Post, {through:KeyPost, foreignKey:'keyId'})
}

module.exports = createAssociations