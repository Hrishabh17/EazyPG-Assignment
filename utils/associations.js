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
    console.log(Object.keys(User.prototype))
    console.log(Object.keys(Post.prototype))
    console.log(Object.keys(Comment.prototype))
}

const createPostUserAssociation = ()=>{
    User.hasMany(Post, {foreignKey: 'authorId'})
    Post.belongsTo(User, {foreignKey: 'authorId', as:'Author', onDelete:'CASCADE'})
}

const createCommentAssociation = ()=>{
    User.hasMany(Comment, {foreignKey: 'userId'})
    Post.hasMany(Comment, {foreignKey: 'postId'})
    Comment.belongsTo(User, {foreignKey: 'userId', onDelete:'CASCADE'})
    Comment.belongsTo(Post, {foreignKey: 'postId', onDelete:'CASCADE'})
}

const createLiketAssociation = ()=>{
    User.hasMany(Like, {foreignKey: 'userId'})
    Post.hasMany(Like, {foreignKey: 'postId'})
    Like.belongsTo(User, {foreignKey: 'userId', onDelete:'CASCADE'})
    Like.belongsTo(Post, {foreignKey: 'postId', onDelete:'CASCADE'})
}

const createKeywordPostAssociation = ()=>{
    Post.belongsToMany(Keyword, {through: KeyPost, foreignKey:'postId', onDelete:'CASCADE'})
    Keyword.belongsToMany(Post, {through:KeyPost, foreignKey:'keyId', onDelete:'CASCADE'})
}

module.exports = createAssociations