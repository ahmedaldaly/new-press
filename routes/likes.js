const {addLike,removeLike,getPostLikes} = require('../controller/likesController')
const router = require('express').Router()
const {authrization} = require('../maddelware/authrazition')
router.route('/:id').post(authrization,addLike).delete(authrization,removeLike).get(getPostLikes)
module.exports = router;