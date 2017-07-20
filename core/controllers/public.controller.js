'use strict';
const express = require('express');
const router = express.Router();
const co = require('co');
const fs = require('fs');
const path = require('path')
const util = require('../util/util.js');
const upload = require('../../lib/fileuploads.lib.js');
const oss = require('../../config/oss.config.js');

router.post('/public/upload', upload.single('file'), async function(req, res, next) {
    var file = req.file;
    var fileType = path.basename(file.mimetype);
    var filePath = file.destination;
    var fileName = file.filename;
    var md5FileName;

    var stream = fs.createReadStream(file.destination + '/' + file.filename);

    var md5FileName = await util.md5File(stream); // 获取文件加密md5
   
    co(function*() {
        var stream = fs.createReadStream(file.destination + '/' + file.filename); // 读取文件    
        var result = yield oss.putStream(md5FileName + '.' + fileType, stream); // 上次OSS
        fs.unlinkSync(file.destination + '/' + file.filename); // 删除文件 
        res.status(200).json({
            'code': '1',
            'data': {
                url: result.url
            }
        });

    }).catch(function(err) {
        res.status(200).json({
            'code': '0',
            'data': []
        })
    });

});

module.exports = router;