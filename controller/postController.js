const asyncHandler = require('express-async-handler');
const { Post, validatePost } = require('../model/Post');
const supabase = require('../config/supabase');
const {Category} = require('../model/category')
module.exports.createPost = asyncHandler(async (req, res) => {
  try {
    // رفع الصور كلها إلى supabase
    const images = [];
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'يجب رفع صورة واحدة على الأقل' });
    }

    for (const file of req.files) {
      const fileName = Date.now() + '-' + encodeURIComponent(file.originalname);

      const { data, error } = await supabase.storage
        .from('press')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('press')
        .getPublicUrl(fileName);

      images.push({ url: urlData.publicUrl });
    }
const category = await Category.findOne({name:req.body.category})
if(!category){res.status(404).json({message:'category not found'})}
    // بناء بيانات البوست
    const postData = {
      title: req.body.title,
      content: req.body.content,
      category: category.name,
      author: req.body.author,
      image: images
    };

    // التحقق من صحة البيانات
    const { error } = validatePost(postData);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // الحفظ في قاعدة البيانات
    const newPost = new Post(postData);
    await newPost.save();

    res.status(201).json({
      message: 'تم إنشاء البوست بنجاح',
      post: newPost
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports.getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  });
  
  // 3. الحصول على بوست واحد
  module.exports.getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'البوست غير موجود' });
    res.status(200).json(post);
  });
  
  // 4. تعديل بوست
  module.exports.updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'البوست غير موجود' });
  
    let newImages = post.image;
  
    if (req.files && req.files.length > 0) {
      // حذف الصور القديمة من supabase
      for (const img of post.image) {
        const urlParts = img.url.split('/');
        const fileName = decodeURIComponent(urlParts[urlParts.length - 1]);
  
        await supabase.storage
          .from('press')
          .remove([fileName]); // حذف الصورة
      }
  
      // رفع الصور الجديدة
      newImages = [];
      for (const file of req.files) {
        const fileExt = path.extname(file.originalname);
        const uniqueName = crypto.randomBytes(16).toString('hex') + fileExt;
  
        const { data, error } = await supabase.storage
          .from('press')
          .upload(uniqueName, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600',
            upsert: false,
          });
  
        if (error) throw error;
  
        const { data: urlData } = supabase.storage
          .from('press')
          .getPublicUrl(uniqueName);
  
        newImages.push({ url: urlData.publicUrl });
      }
    }
  
    const category = await Category.findOne({ name: req.body.category });
    if (!category) return res.status(404).json({ message: 'الفئة غير موجودة' });
  
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = category.name || post.category;
    post.author = req.body.author || post.author;
    post.image = newImages;
  
    const { error } = validatePost(post.toObject());
    if (error) return res.status(400).json({ error: error.details[0].message });
  
    await post.save();
    res.status(200).json({ message: 'تم التحديث بنجاح', post });
  });
  
  // 5. حذف بوست
  module.exports.deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'البوست غير موجود' });
  
    await post.deleteOne();
    res.status(200).json({ message: 'تم الحذف بنجاح' });
  });