const Jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const {User} = require('../model/User');
module.exports.authrization = asyncHandler (async (req , res , next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = Jwt.verify(token , process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next()
    }catch(err){res.status(500).json(err)}
})
module.exports.Admin = asyncHandler (async (req, res ,next)=>{
    try{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json({message:'you are not admin'})
        }
    }catch(err){res.status(500).json(err)}
})