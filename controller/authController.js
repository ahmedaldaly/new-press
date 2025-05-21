const {User, validateLogIn, validateRegister } = require('../model/User');
const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const BlacklistedToken = require('../model/blacklistedToken');
const nodemailer = require('nodemailer')
module.exports.Register = asyncHandler(async(req,res)=>{
    try{
        const {error} = validateRegister(req.body);
        if(error){res.status(400).json({message:error.details[0].message})}
        const user = await User.findOne({email:req.body.email});
        if(user){res.status(400).json({message:"User already exists"})}
        const hashPassword = await bcrypt.hash(req.body.password ,10);
        const newUser =new User({
            name:req.body.name,
            email:req.body.email,
            password:hashPassword
        })
        await newUser.save()
        const token = Jwt.sign({id:newUser._id ,isAdmin:newUser.isAdmin},process.env.JWT_SECRET,{expiresIn:"7d"})
        newUser.token = token;
        res.status(201).json(newUser)

    }catch(err){res.status(500).json(err)}
})

module.exports.LogIn = asyncHandler(async(req,res)=>{
    try{
        const {error} = validateLogIn(req.body);
        if(error){res.status(400).json({message:error.details[0].message})}
        const user = await User.findOne({email:req.body.email});
        if(!user){res.status(400).json({message:"Check your email or password "})}
        const checkPassword = await bcrypt.compare(req.body.password ,user.password);
        if(!checkPassword){res.status(400).json({message:"Check your email or password "})}
        const token = Jwt.sign({id:user._id ,isAdmin:user.isAdmin},process.env.JWT_SECRET ,{expiresIn:'7d'});
        user.token = token;
        res.status(200).json(user)
    }catch(err){res.status(500).json(err)}
})

module.exports.LogOut = asyncHandler(async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(400).json({ message: 'لم يتم تقديم توكن' });
        }

        // إضافة التوكن إلى القائمة السوداء
        await BlacklistedToken.create({ token });

        // حذف التوكن من المستخدم
        await User.findByIdAndUpdate(req.user.id, { token: null });

        res.json({ message: 'تم تسجيل الخروج بنجاح' });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ في تسجيل الخروج', error: error.message });
    }
});
module.exports.resetPassword = asyncHandler(async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // إنشاء التوكن
      const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '20m' });
  
      // إنشاء رابط إعادة التعيين
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
      // إنشاء transporter باستخدام جيميل
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ranaandahmed55@gmail.com',   // بريدك في جيميل
          pass: process.env.PASSWORD // خلي App Password في .env
        }
      });
  
      // إرسال البريد
      const info = await transporter.sendMail({
        from: `"Your App Support" <ranaandahmed55@gmail.com>`,
        to: email,
        subject: 'إعادة تعيين كلمة المرور',
        html: `
          <div dir="rtl" style="font-family: Arial; max-width: 600px;">
            <h3>مرحباً ${user.name}</h3>
            <p>اضغط على الزر أدناه لإعادة تعيين كلمة المرور:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
              إعادة تعيين كلمة المرور
            </a>
            <p>الرابط صالح لمدة 20 دقيقة.</p>
          </div>
        `
      });
  
      console.log("Message sent:", info.messageId);
  
      res.status(200).json({ message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'حدث خطأ أثناء إرسال الإيميل', error: err.message });
    }
  });
  module.exports.resetPasswordToken =asyncHandler (async (req, res)=>{
    try{
        const {token} = req.params;
        const decoded = Jwt.verify(token , process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user){res.status(404).json({message:'user not found'})}
        const hashPassword = await bcrypt.hash(req.body.password ,10);
        user.password = hashPassword;
        await user.save();
        res.status(200).json({message:'password reset successfully'})
    }catch(err){res.status(500).json(err)}
  }) 