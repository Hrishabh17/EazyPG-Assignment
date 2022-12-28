const { Sequelize } = require('sequelize')
const { sequelize } = require('../utils/database')

const KeyPost = sequelize.define('KeyPost',
    {
        keyPostId:{
            type:Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        keyId:{
            type:Sequelize.INTEGER,
            allowNull:false,
        },
        postId:{
            type:Sequelize.STRING,
            allowNull:false,
        }
    },
    {
        freezeTableName:true,
        timestamps:false
    }
)

module.exports = {
    KeyPost
}