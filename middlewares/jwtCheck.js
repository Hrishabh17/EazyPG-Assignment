const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const verify = (req, res, next)=>{
    const token = req.get('Authorization')
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY)
    } 
    catch(err) {
        err.statusCode = 500
        throw err
    }
    if(!decodedToken){
        const error = new Error('Not Authorized')
        error.statusCode = 401
        throw error
    }
    else{
        req.userId = decodedToken.userId
    }
    next()
}

module.exports = verify