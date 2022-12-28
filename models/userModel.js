const { Sequelize } = require('sequelize')
const { sequelize } = require('../utils/database')

const User = sequelize.define("User", 
    {
        userId:{
            type:Sequelize.UUID,
            defaultValue:Sequelize.UUIDV4,
            allowNull:false,
            primaryKey:true
        },
        userName:{
            type:Sequelize.STRING,
            allowNull:false,
        },
        password:{
            type:Sequelize.STRING,
            allowNull:false
        },
        emailId:{
            type:Sequelize.STRING,
            allowNull:false
        }
    }, 
    {
        freezeTableName:true, 
        timestamps:true
    }
)

const checkUserNameAlreadyExists = async(userName) =>{
    const res = await User.findOne({where:{userName: userName}, attributes:['userId']})
    return res
}

const checkUserIdAlreadyExists = async(userId) =>{
    const res = await User.findOne({where:{userId: userId}, attributes:['userId']})
    return res
}

const checkEmailAlreadyExists = async(emailId) =>{
    const res = await User.findOne({where:{emailId: emailId}, attributes:['userId']})
    return res
}


module.exports = { 
    User,
    checkUserNameAlreadyExists,
    checkEmailAlreadyExists,
    checkUserIdAlreadyExists
}