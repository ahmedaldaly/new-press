const mongoose = require('mongoose');
const Joi = require('joi')
const UserSchema = new mongoose.Schema({
    name:{
        required:true,
        unique:true,
        trim:true,
        type:String
    },
    email:{
        required:true,
        type:String,
        unique:true,
        trim:true,
    },
    token:{
        type:String,
        trim:true,
    },
    password:{
        required:true,
        type:String,
        minlength:8
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
const User = mongoose.model('User',UserSchema);

function validateRegister (obj){
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8).max(50),
        
    })
    return schema.validate(obj)
}
function validateLogIn (obj){
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8).max(50),
    })
    return schema.validate(obj)
}
module.exports = {
    User,
    validateLogIn,
    validateRegister
}