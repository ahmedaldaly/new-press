const mongoose = require('mongoose');
const Joi = require('joi');
const commentSchema = new mongoose.Schema ({
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 400,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    isAdminReply: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const Comment = mongoose.model('Comment', commentSchema);

function validateComment(obj) {
    const schema = Joi.object({
        content: Joi.string().required().min(1).max(400),
        post: Joi.string().required(),
        user: Joi.string().required(),
        parentComment: Joi.string().allow(null),
        isAdminReply: Joi.boolean()
    });
    return schema.validate(obj);
}

module.exports = { Comment, validateComment };