const express = require('express');
const router = express.Router();
const {addComment,getPostComments,addAdminReply,deleteComment} = require('../controller/commentController');
const { Admin, authrization } = require('../maddelware/authrazition');

// إضافة تعليق جديد
router.post('/', authrization, addComment);

// الحصول على تعليقات منشور معين
router.get('/post/:postId', getPostComments);

// إضافة رد من المشرف
router.post('/admin-reply', authrization,Admin,addAdminReply);

// حذف تعليق
router.delete('/:id', authrization, deleteComment);

module.exports = router; 