const { Sequelize } = require('sequelize')
const { sequelize } = require('../utils/database')

const Post = sequelize.define('Post',
    {
        PostId:{
            type:Sequelize.STRING,
            allowNull:false,
            primaryKey:true
        },
        title:{
            type:Sequelize.STRING,
            allowNull:false,
        },
        summary:{
            type:Sequelize.STRING(1500),
            allowNull:false
        },
        content:{
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

module.exports = { Post }