const { Sequelize } = require('sequelize')
const { sequelize } = require('../utils/database')

const Like = sequelize.define('Like',
    {
        LikeId:{
            type:Sequelize.UUID,
            defaultValue:Sequelize.UUIDV4,
            allowNull:false,
            primaryKey:true
        }
    },
    {
        freezeTableName:true,
        timestamps:false
    }
)

const isAuthenticatedToUnLike = async(postId, userId)=>{
    const result = await Like.findOne({where:{postId:postId, userId:userId}})
    return result
}

module.exports = { 
    Like,
    isAuthenticatedToUnLike 
}