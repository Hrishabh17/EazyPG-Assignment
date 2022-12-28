const { Sequelize } = require('sequelize')
const { sequelize } = require('../utils/database')

const Post = sequelize.define('Post',
    {
        postId:{
            type:Sequelize.STRING,
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

const PostAlreadyExists = async(title) =>{
    const result = await Post.findOne({where:{title:title}, attributes:['title']})
    return result
}

module.exports = { 
    Post,
    PostAlreadyExists
}