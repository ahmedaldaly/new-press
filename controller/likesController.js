const {Likes ,validateLike} = require('../model/likes')
const {User} = require ('../model/User')
const {Post} = require ('../model/Post')
const asyncHandler = require('express-async-handler')
module.exports.addLike = asyncHandler(async (req , res)=>{
    try{
        const {error} = validateLike({
            user:req.user.id,
            post:req.params.id
        })
        if(error) {res.status(400).json({message:error.details[0].message})}
        const check = await Likes.findOne({user:req.user.id,post:req.params.id})
        if(check){res.status(400).json({message:'You already liked this post'})}
        const newLike = new Likes({
            user:req.user.id,
            post:req.params.id
        })
        const saveLike = await newLike.save()
        res.status(201).json({message:" liked successfully"})
    }catch(err){res.status(500).json(err)}
})
module.exports.removeLike = asyncHandler(async(req , res)=>{
    try{
        const remove = await Likes.findOneAndDelete({user:req.user.id ,post:req.params.id})
        if (!remove){res.status(404).json({message:'You have not liked this post'})}
        res.status(200).json({message:'You have removed your like'})
    }catch(err){res.status(500).json(err)}
})
module.exports.getPostLikes = asyncHandler(async (req , res)=>{
    try{
        const find = await Likes.find({post:req.params.id})
        if(!find){res.status(404).json({message:'No Likes in this post'})}
        res.status(200).json(find)
    }catch(err){res.status(500).json(err)}
})