const mongoose = require('mongoose');
const Joi = require('joi')
const PostSchema = new mongoose.Schema({
    title:{
        required:true,
        type:String,
        trim:true,
        minlength:5,
        maxlength:200
    },
    content:{
        required:true,
        type:String,
        trim:true,
        minlength:10
    },
    category:{
        type:String,
        required:true,
    },
    image:[
        {
         url:{
            required:true,
            type:String
         },
        }
    ],
    author:{
        type:String,
        required:true
    }
},{timestamps:true})
const Post = mongoose.model ('Post',PostSchema)
function validatePost(obj) {
    const schema = Joi.object({
        title:Joi.string().required().min(5).max(200),
        content: Joi.string().required().min(10),
        category: Joi.string().required(),
        image: Joi.array().items(Joi.object({
            url:Joi.string().required(),
        })) ,
        author: Joi.string().required()
    })
    return schema.validate(obj)
}
module.exports = {
    Post,
    validatePost
}