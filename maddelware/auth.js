const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../model/blacklistedToken');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'غير مصرح لك بالوصول' });
        }

        // التحقق من أن التوكن غير ملغى
        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'تم تسجيل الخروج من هذا الحساب' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'غير مصرح لك بالوصول' });
    }
}; 