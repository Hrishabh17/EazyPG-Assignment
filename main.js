const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const {sequelize} = require('./utils/database')
const createAssociations = require('./utils/associations')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/users', require('./routes/userRoute'))
app.use('/api/posts', require('./routes/postRoute'))
app.use('/api/comments', require('./routes/commentRoute'))
app.use('/api', require('./routes/likeRoute'))


app.all('*', (req, res)=>{
    const error = new Error(
        `Resource ${req.originalUrl} not found`
    )
    error.statusCode = 404
    throw error
})

app.use((error, req, res, next) => {
    console.log(error);
    let data;
    let message;
    const status = error.statusCode || 500
    if(error.data){
        data = error.data || []
    }
    if(status !== 500){
        message = error.message
    }
    else{
        message = "Something went wrong! Server or Database Error"
    }

    res.status(status).json({ message: message, data:data});
});

createAssociations()

// sequelize.sync({force:true}).then((res)=>{
//     app.listen(4000 || process.env.PORT)
// }).catch((err)=>{
//     console.log(err)
// })

sequelize.authenticate().then(()=>{
    app.listen(4000 || process.env.PORT, ()=>console.log(`Server is running on Port 4000`))
})