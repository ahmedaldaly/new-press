const router = require('express').Router();
const {createCategory ,getAllCategory ,getCategory ,removeCategory} = require('../controller/categoryController');
const { authrization, Admin } = require('../maddelware/authrazition');

router.route('/').post(authrization,Admin,createCategory).get(getAllCategory)
router.route('/:id').delete(authrization,Admin,removeCategory).get(getCategory)
module.exports = router