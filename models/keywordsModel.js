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
    const result = await Keyword.findOne({where:{key:keyword}, attributes:['keyId']})
    if(!result){
        const key = new Keyword({
            key:keyword
        })
        return key.save().then((res)=>{
            return res
        }).catch((err)=>{
            next(err)
        })
    }
    return result
}

module.exports = {
    Keyword,
    createIfKeyNotExists
}