'use strict';

var path = require("path");
var spawn = require("child_process").spawn;
var goodsModel = require('../models/goods.model.js');


exports.init = function(req, res, next) {
    starCasper()
    res.send('11');
}

exports.get = async function(req, res, next) {
    var param = req.query || req.params
    var page = parseInt((param.page ? param.page : 1));
    var pageSize = parseInt((param.pageSize ? param.pageSize : 30));
    var data = {};
    param.name ? data.name = new RegExp(param.name) : '';

    var count = await goodsModel.count({})
        .exec(function(err, count) {
            err ? res.send(err) : '';
            return count
        })

    goodsModel.find(data)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean()
        .exec(function(err, data) {
            err ? res.send(err) : '';
            res.status(200).json({
                'code': '1',
                'count': count,
                'list': data,
                'total_page': Math.ceil(count / pageSize),
                'now_page': page
            });
        })
}

// 添加
exports.add = function(req, res, next) {
    var param = req.body;
    
    goodsModel.create(JSON.parse(param.data), function(err, results) {
        if (err) {
            console.log('出错')
        }
        // console.log(results)
    });
}

// 启动casperjs线程
function starCasper(fn) {
    

    var child = spawn('casperjs', ['./core/casper/taoBaoGoods.js','--web-security=no']);

    child.stdout.on('data', function(data) {
        console.log('标准输出: ' + data);
    });

    child.stderr.on('data', function(data) {
        console.log('标准错误: ' + data);
    });

    child.on('close', function(code) {
        switch (code) {
            case 0:
                console.log("casperjs.js正常退出");
                break;
            case 1:
                console.log("casperjs.js访问失败");
                break;
            case 2:
                console.log("casperjs.js超时退出");
                break;
            default:
                console.log("casperjs.js异常退出");
                break;
        };
    });
}