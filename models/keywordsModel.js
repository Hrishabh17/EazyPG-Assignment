const { Sequelize } = require('sequelize')
const { sequelize } = require('../utils/database')

const Keyword = sequelize.define('Keyword',
    {
        keyId:{
            type:Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        key:{
            type:Sequelize.STRING,
            allowNull:false,
            unique:true
        }
    },
    {
        freezeTableName:true,
        timestamps:false
    }
)

const createIfKeyNotExists = async(keyword, next)=>{
    return Keyword.findOrCreate({where:{
            key:keyword
        }
    })
}

module.exports = {
    Keyword,
    createIfKeyNotExists
}