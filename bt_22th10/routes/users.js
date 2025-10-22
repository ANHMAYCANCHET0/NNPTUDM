var express = require('express');
var router = express.Router();
let users = require('../schemas/users');
let roles = require('../schemas/roles');
let { uploadAFileWithField, uploadMultiFilesWithField } = require('../utils/uploadHandler')
let { Authentication } = require('../utils/authHandler')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let allUsers = await users.find({isDeleted:false}).populate({
    path: 'role',
    select:'name'
  });
  res.send({
    success:true,
    data:allUsers
  });
});
router.get('/:id', async function(req, res, next) {
  try {
    let getUser = await users.findById(req.params.id);
    if(!getUser || getUser.isDeleted){
      return res.status(404).send({ success:false, message: 'User không tồn tại' });
    }
    res.send({ success:true, data:getUser });
  } catch (error) {
     res.status(500).send({ success:false, error: error.message });
  }
});

router.post('/', async function(req, res, next) {
  let role = req.body.role?req.body.role:"USER";
  let roleId;
  role = await roles.findOne({name:role});
  roleId = role._id;
  let newUser = new users({
    username:req.body.username,
    email:req.body.email,
    password:req.body.password,
    role:roleId
  })
  await newUser.save();
  res.send({
      success:true,
      data:newUser
    })
});
router.put('/:id', async function(req, res, next) {
  let user = await users.findById(req.params.id);
  user.email = req.body.email?req.body.email:user.email;
  user.fullName = req.body.fullName?req.body.fullName:user.fullName;
  user.password = req.body.password?req.body.password:user.password;
  await user.save()
  res.send({
      success:true,
      data:user
    })
});

// Route upload avatar cho user (yêu cầu đăng nhập)
// POST /users/avatar (field: avatar)
router.post('/avatar', Authentication, uploadAFileWithField('avatar'), async function(req, res, next){
  try {
    // Lấy user từ req.userId do middleware Authentication gán
    let user = await users.findById(req.userId);
    if(!user) return res.status(404).send({success:false, message: 'User không tồn tại'});
    // Tạo URL tới file đã upload
    let URL = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
    user.avatarURL = URL;
    await user.save();
    // Trả về thông tin user đã cập nhật
    res.send({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
})

// Route upload nhiều ảnh cho user (yêu cầu đăng nhập)
// POST /users/album (field: images)
router.post('/album', Authentication, uploadMultiFilesWithField('images'), async function(req, res, next){
  try {
    if(!req.files || req.files.length==0) return res.status(400).send({success:false, message:'Không có file được upload'});
    // Map các file thành URL
    let URLs = req.files.map(function(file){
      return `${req.protocol}://${req.get('host')}/files/${file.filename}`
    })
    // Ở ví dụ này ta chỉ trả về danh sách URL; có thể lưu vào user nếu muốn
    res.send({ success:true, data: URLs })
  } catch (error) {
    res.status(500).send({ success:false, error: error.message })
  }
})

module.exports = router;
