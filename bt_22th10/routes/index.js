var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Trang demo upload 1 ảnh
router.get('/upload-single', function(req, res, next) {
  res.render('upload_single');
});

// Trang demo upload nhiều ảnh
router.get('/upload-multi', function(req, res, next) {
  res.render('upload_multi');
});

module.exports = router;
