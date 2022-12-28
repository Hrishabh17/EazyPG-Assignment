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

module.exports = { Like }