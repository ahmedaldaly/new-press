const {User  } = require('../model/User');
const Jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
module.exports.getAllUsers = asyncHandler (async(req,res)=>{
    try{
        const find = await User.find().select('-password');
        if(!find){res.status(404).json({message:'users not found'})}
        res.status(200).json(find)
    }catch(err){res.status(500).json(err)}
})
module.exports.getUserById = asyncHandler (async(req,res)=>{
    try{
        const find = await User.findById(req.params.id).select('-password');
        if(!find){res.status(404).json({message:'users not found'})}
        res.status(200).json(find)
    }catch(err){res.status(500).json(err)}
})
module.exports.updateUser = asyncHandler (async (req ,res)=>{
    try{
        const find = await User.findByIdAndUpdate(req.params.id ,{
            isAdmin:req.body.isAdmin
        },{new:true})
        if (!find){res.status(404).json({message:'user not found'})}
        res.status(200).json(find)
    }catch(err){res.status(500).json(err)}
})
module.exports.deleteUser = asyncHandler (async (req , res)=>{
    try{
        const remove = await User.findByIdAndDelete(req.params.id)
        if (!remove){res.status(404).json({message:'user not found'})}
        res.status(200).json({message:'user deleted successfully'})
    }catch(err){res.status(500).json(err)}
})
module.exports.getUserByTOken = asyncHandler(async(req, res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded =Jwt.verify(token , process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if(!user){res.status(404).json({message:'user not found'})}
        res.status(200).json(user)
    }catch(err){res.status(500).json(err)}
})