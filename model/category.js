const mongoose = require('mongoose');
const Joi = require('joi');
const categoryScahema = new mongoose.Schema({
    name:{
        required:true,
        type:String,
        unique:true,
        trim:true
    }
},{timestamps:true})
const Category = mongoose.model('Category',categoryScahema);
function validateCategory(obj){
    const schema = Joi.object({
        name:Joi.string().required()
    })
    return schema.validate(obj)
}
module.exports = {
    Category,
    validateCategory
}