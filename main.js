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


app.all('*', (req, res)=>{
    const error = new Error(
        `Resource ${req.originalUrl} not found`
    )
    error.statusCode = 404
    throw error
})

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data || []
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