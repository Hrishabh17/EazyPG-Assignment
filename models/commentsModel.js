const { Sequelize } = require('sequelize')
const { sequelize } = require('../utils/database')

const Comment = sequelize.define('Comment',
    {
        commentId:{
            type:Sequelize.UUID,
            allowNull:false,
            primaryKey:true,
            defaultValue:Sequelize.UUIDV4
        },
        content:{
            type:Sequelize.STRING(1000),
            allowNull:false
        }
    },
    {
        freezeTableName:true,
        timestamps:true
    }
)

const isAuthenticatedUser = async(commentId, userId)=>{
    const result = await Comment.findOne({where:{commentId:commentId, userId:userId}})
    return result
}

const commentExists = async(commentId)=>{
    const result = await Comment.findOne({where:{commentId:commentId}})
    return result
}

module.exports = { 
    Comment,
    isAuthenticatedUser,
    commentExists 
}