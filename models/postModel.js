const { Sequelize, Op } = require('sequelize')
const { sequelize } = require('../utils/database')

const Post = sequelize.define('Post',
    {
        postId:{
            type:Sequelize.UUID,
            defaultValue:Sequelize.UUIDV4,
            allowNull:false,
            primaryKey:true
        },
        title:{
            type:Sequelize.STRING(25),
            allowNull:false,
        },
        summary:{
            type:Sequelize.STRING(1500),
            allowNull:false
        },
        content:{
            type:Sequelize.TEXT,
            allowNull:false
        },
        category:{
            type:Sequelize.STRING,
            allowNull:false
        },
        published:{
            type:Sequelize.INTEGER,
            allowNull:false
        }
    },
    {
        freezeTableName:true,
        timestamps:true
    }
)

const PostAlreadyExistsByTitle = async(title) =>{
    const result = await Post.findOne({where:{title:title}, attributes:['title']})
    return result
}

const PostAlreadyExistsById = async(id) =>{
    const result = await Post.findOne({where:{postId:id}, attributes:['title']})
    return result
}

const PostAlreadyExistsByTitleId = async(title, id) =>{
    const result = await Post.findOne({where:{postId:{[Op.not]:id}, title:title}, attributes:['title']})
    return result
}

const isAuthenticatedToDelete = async(postId, authorId) =>{
    const result = await Post.findOne({where:{postId:postId, authorId:authorId}})
    return result
}

module.exports = { 
    Post,
    PostAlreadyExistsByTitle,
    PostAlreadyExistsById,
    PostAlreadyExistsByTitleId,
    isAuthenticatedToDelete
}