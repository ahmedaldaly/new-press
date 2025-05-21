const { Comment, validateComment } = require('../model/comment');
const { Post } = require('../model/Post');
const { User } = require('../model/User');

// إضافة تعليق جديد
module.exports.addComment = async (req, res) => {
    try {
        const { error } = validateComment({
            content: req.body.content,
            post: req.body.post,
            user: req.user.id
        });
        if (error) return res.status(400).json({ message: error.details[0].message });

        const post = await Post.findById(req.body.post);
        if (!post) return res.status(404).json({ message: 'المنشور غير موجود' });
        const userId = await req.user.id
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        const comment = new Comment({
            content: req.body.content,
            post: req.body.post,
            user: userId,
            parentComment: req.body.parentComment || null,
            isAdminReply: req.body.isAdminReply || false
        });

        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ في إضافة التعليق', error: error.message });
    }
};

// الحصول على تعليقات منشور معين
module.exports.getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('user', 'name')
            .populate('parentComment')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ في جلب التعليقات', error: error.message });
    }
};

// إضافة رد من المشرف
module.exports.addAdminReply = async (req, res) => {
    try {
        const admin = await User.findById(req.user.id);
        if (!admin || !admin.isAdmin) {
            return res.status(403).json({ message: 'غير مصرح لك بإضافة رد' });
        }

        const parentComment = await Comment.findById(req.body.parentComment);
        if (!parentComment) {
            return res.status(404).json({ message: 'التعليق الأصلي غير موجود' });
        }

        const reply = new Comment({
            content: req.body.content,
            post: parentComment.post,
            user: req.user.id,
            parentComment: req.body.parentComment,
            isAdminReply: true
        });

        await reply.save();
        res.status(201).json(reply);
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ في إضافة الرد', error: error.message });
    }
};

// حذف تعليق
module.exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'التعليق غير موجود' });
        }

        const user = await User.findById(req.user.id);
        if (!user.isAdmin && comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'غير مصرح لك بحذف هذا التعليق' });
        }

        // حذف جميع الردود المرتبطة بالتعليق
        await Comment.deleteMany({ parentComment: req.params.id });
        
        // حذف التعليق نفسه
        await Comment.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'تم حذف التعليق وجميع الردود المرتبطة به بنجاح' });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ في حذف التعليق', error: error.message });
    }
};
