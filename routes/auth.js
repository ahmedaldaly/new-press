const router = require('express').Router();

const {Register , LogIn ,LogOut ,resetPassword,resetPasswordToken} = require('../controller/authController');
router.post('/register',Register);
router.post('/login',LogIn);
router.post('/logout',LogOut);
router.post('/reset-password',resetPassword);
router.post('/reset-password/:token',resetPasswordToken)

module.exports =router