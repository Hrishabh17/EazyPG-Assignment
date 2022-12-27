const { Sequelize } = require('sequelize')
const { sequelize } = require('../utils/database')

const Comment = sequelize.define('Comment',
    {
        commentId:{
            type:Sequelize.STRING,
            allowNull:false,
            primaryKey:true
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

module.exports = { Comment }