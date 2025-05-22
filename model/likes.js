const mongoose = require('mongoose')
const Joi = require('joi')
const LikeSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    post: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    }

},{timestamps:true})
const Likes = mongoose.model('Likes',LikeSchema);
function validateLike (obj){
    const schema = Joi.object({
        user: Joi.string().required(),
        post: Joi.string().required()
    })
    return schema.validate(obj)
}

module.exports = {Likes ,validateLike}