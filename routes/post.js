const router = require('express').Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} = require('../controller/postController');

const { Admin, authrization } = require('../maddelware/authrazition');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', authrization, Admin, upload.array('images'), createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', authrization, Admin, upload.array('images'), updatePost);
router.delete('/:id', authrization, Admin, deletePost);

module.exports = router;
