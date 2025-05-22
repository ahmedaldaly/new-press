const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors');
const {notFound ,errorHandler} = require('./maddelware/handelError')
const dotenv = require('dotenv').config();

const ConnectDB = require('./config/ConnectDB');
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true,
}));
ConnectDB()
app.get('/',(req , res)=>{
    res.status(200).json({message:'server is running'})
})
app.use(express.json());
app.use('/api/auth',require('./routes/auth'))
app.use('/api/user',require('./routes/user'))
app.use('/api/post',require('./routes/post'))
app.use('/api/category',require('./routes/category'))
app.use('/api/comments', require('./routes/commentRoutes'))
app.use('/api/like', require('./routes/likes'))
app.use(notFound);
app.use(errorHandler);

app.listen(port ,()=>{
    console.log(`server is running in port ${port}`)
})