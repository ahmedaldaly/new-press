const router = require('express').Router();
const {getAllUsers,getUserById,updateUser,deleteUser,getUserByTOken} = require('../controller/userController');
const {Admin,authrization} = require('../maddelware/authrazition')
const multer = require('multer');
const supabase = require('../config/supabase');
router.get('/',authrization,Admin,getAllUsers);
router.route('/:id').get(getUserById).put(authrization,Admin,updateUser).delete(authrization,Admin,deleteUser);
router.get('/token', authrization,getUserByTOken)


module.exports =router