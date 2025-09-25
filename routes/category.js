var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');

// Lấy tất cả category
router.get('/', async function(req, res, next) {
  let categories = await categoryModel.find({});
  res.send({ success: true, data: categories });
});

// Lấy 1 category theo id
router.get('/:id', async function(req, res, next) {
  let item = await categoryModel.findById(req.params.id);
  res.send({ success: true, data: item });
});

// Thêm mới category
router.post('/', async function(req, res, next) {
  let newItem = new categoryModel({ name: req.body.name });
  await newItem.save();
  res.send({ success: true, data: newItem });
});

// Sửa category
router.put('/:id', async function(req, res, next) {
  let updatedItem = await categoryModel.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  res.send({ success: true, data: updatedItem });
});

// Xoá category
router.delete('/:id', async function(req, res, next) {
  await categoryModel.findByIdAndDelete(req.params.id);
  res.send({ success: true });
});

module.exports = router;