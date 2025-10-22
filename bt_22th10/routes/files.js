var express = require('express');
var router = express.Router();
var path = require('path')
let fs = require('fs')
let { uploadAFileWithField, uploadMultiFilesWithField } = require('../utils/uploadHandler')
const { Response } = require('../utils/responseHandler');

router.get('/:filename', function (req, res, next) {
    // Tìm file trong hai thư mục: resources/files và resources/images
    let pathFile1 = path.join(__dirname, "../resources/files/", req.params.filename);
    let pathFile2 = path.join(__dirname, "../resources/images/", req.params.filename);
    if (fs.existsSync(pathFile1)) {
        res.status(200).sendFile(pathFile1);
    } else if (fs.existsSync(pathFile2)) {
        res.status(200).sendFile(pathFile2);
    } else {
        Response(res, 404, false, "File not found");
    }
})


router.post("/uploads", uploadAFileWithField('image'), function (req, res, next) {
    let URL = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
    Response(res, 200, true, URL)
})
router.post("/uploadMulti", uploadMultiFilesWithField('image'), function (req, res, next) {
    let URLs = req.files.map(function(file){
        return `${req.protocol}://${req.get('host')}/files/${file.filename}`
    })
    Response(res, 200, true, URLs)
})

module.exports = router;