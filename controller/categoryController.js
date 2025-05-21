const {   Category,validateCategory} = require('../model/category');
const asyncHandler = require('express-async-handler');
module.exports.createCategory = asyncHandler(async(req , res)=>{
    try{
        const {error} = validateCategory(req.body);
        if(error){res.status(400).json({message:error.details[0].message})}
        const category = new Category({
            name:req.body.name
        })
        await category.save();
        res.status(201).json(category);
    }catch(err){res.status(500).json(err)}
})
module.exports.getAllCategory = asyncHandler(async(req , res)=>{
    try{
        const find = await Category.find();
        if(!find){res.status(404).json({message:'category not found '})}
        res.status(200).json(find)
    }catch(err){res.status(500).json(err)}
})
module.exports.getCategory = asyncHandler(async(req , res)=>{
    try{
        const find = await Category.findById(req.params.id);
        if(!find){res.status(404).json({message:'category not found '})}
        res.status(200).json(find)
    }catch(err){res.status(500).json(err)}
})
module.exports.removeCategory = asyncHandler(async(req , res)=>{
    try{
        const find = await Category.findByIdAndDelete(req.params.id);
        if(!find){res.status(404).json({message:'category not found '})}
        res.status(200).json({message:'category deleted successfully'})
    }catch(err){res.status(500).json(err)}
})