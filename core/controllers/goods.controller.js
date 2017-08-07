'use strict';
var _ = require('lodash');
var spawn = require("child_process").spawn;
var goodsModel = require('../models/goods.model.js');
var goodsDetailsModel = require('../models/goodsDetails.model.js');
var util = require('../util/util.js')
var async = require('async');

exports.init = async function(req, res, next) {


    // var imgUrl = 'https://img.alicdn.com/bao/uploaded/i3/TB19BPHSXXXXXX_XVXXXXXXXXXX_!!0-item_pic.jpg_430x430q90.jpg'

    // var ossImg = await util.uploadOss(imgUrl)
    // console.log(ossImg.url)
    starCasper();
    res.send('11');
}

exports.init2 = function(req, res, next) {
    starCasper2();
    res.send('22');
}

exports.get = async function(req, res, next) {
    var param = req.query || req.params
    var page = parseInt((param.page ? param.page : 1));
    var pageSize = parseInt((param.pageSize ? param.pageSize : 30));
    var data = {
        'detailsPic':[],
        'mainPic':[]
    };
    param.name ? data.name = new RegExp(param.name) : '';

    var count = await goodsModel.count({})
        .exec(function(err, count) {
            err ? res.send(err) : '';
            return count
        })

    var goodId = await goodsDetailsModel.find({}).select('goodId')

    goodsModel.find({'_id':{$nin:goodId}})
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

// 校验是否有这个商品
exports.verifyId = async function(req, res, next) {
    var param = req.body;
    var datas = JSON.parse(param.data);

    var len = datas.length;
    var auctionIds = []
    for (var i = 0; i < len; i++ ){
        auctionIds.push(datas[i].auctionId)
    }

    goodsModel.find({auctionId:{$in:auctionIds}}, function(err, data) {
        err ? res.send(err) : '';

        var results = [];
        var dataLen = data.length;
        for (var i = 0; i < len; i++ ){
            for ( var j = 0 ;  j < len; j++){
                if (  datas[i].auctionId  == data[j].auctionId ){
                    results.push(data[i])
                }
            }
           
        }
        
        res.status(200).json({
            'code': '1',
            'list': results,
        });
    })
}



// 添加
exports.add = function(req, res, next) {
    var param = req.body;

    var data = param.data;
    goodsModel.create(JSON.parse(data), function(err, results) {
        err ? res.send(err) : '';
        res.status(200).json({
            'code': '1',
            'data': results
        });
    })
}


// 添加
exports.addDetails = function(req, res, next) {
    var param = req.body;
    
    var data = param.data;
    goodsDetailsModel.create(JSON.parse(data), function(err, results) {
        err ? res.send(err) : '';
        res.status(200).json({
            'code': '1',
            'data': results
        });
    })
}


// 添加
exports.modify = async function(req, res, next) {
    var param = req.body;
    var data = JSON.parse(param.data);
    var _id = data._id;

    console.log(data.mainPic)
    console.log(data.detailsPic)
    var data = {
        'mainPic': data.mainPic,
        'detailsPic':data.detailsPic
    }

    goodsModel.update({ '_id': _id }, data, function(err, results) {
        err ? res.send(err) : '';
        res.status(200).json({
            'code': '1',
            'data': results
        });
    })
}

// 启动casperjs线程
function starCasper(fn) {


    var child = spawn('casperjs', ['./core/casper/taoBaoGoods10.js', '--web-security=no']);

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

// 启动casperjs线程
function starCasper2(fn) {


    var child = spawn('casperjs', ['./core/casper/taoBaoGoodsPic.js', '--web-security=no']);

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
                starCasper2();
                console.log("casperjs.js访问失败");
                break;
            case 2:
                starCasper2();
                console.log("casperjs.js超时退出");
                break;
            default:
                starCasper2();
                console.log("casperjs.js异常退出");
                break;
        };
    });
}