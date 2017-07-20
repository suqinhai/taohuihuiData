'use strict';
const util = require('../util/util.js');
const productModel = require('../models/product.model.js');

/**
 * 获取首页商品
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.get = function(req, res, next) {
    var param = req.query || req.params
    var page = parseInt((param.page ? param.page : 1));
    var pageSize = parseInt((param.pageSize ? param.pageSize : 30));
    var data = {};
    param.name ? data.name = new RegExp(param.name) : '';


    
    productModel.find(data)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean()
        .exec(function(err, results) {
            res.status(200).json({
                'code': '1',
                'data': results
            });
        })
}

/**
 * 添加首页商品
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.add = function(req, res, next) {
    var param = req.query || req.params
    var data = {
        'picUrl': param.picUrl, //首页商品图片
        'title': param.title, // 标题
        'origPrice': param.origPrice, //原价
        'nowPrice': param.nowPrice, //现价
        'posterPic':param.poster, //详情轮播
        'detailsPic':param.detailsPic, //详情图
        'peopleBug':param.peopleBug, //购买人数
        'url': param.url, // 购买链接
        'taoCode':param.taoCode, //淘口令
        'des': param.des, //推荐理由
        'createTime': util.dataFormat(new Date()),
        'updateTime': util.dataFormat(new Date()),
    };

    productModel.create(data, function(err, results) {
        res.status(200).json({
            'code': '1',
            'data': results
        });
    });
}

/**
 * 修改首页商品
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.modify = function(req, res, next) {
    var param = req.query || req.params
    var _id = param.id
    var data = {
        'picUrl': param.picUrl, //首页商品图片
        'title': param.title, // 标题
        'origPrice': param.origPrice, //原价
        'nowPrice': param.nowPrice, //现价
        'posterPic':param.poster, //详情轮播
        'detailsPic':param.detailsPic, //详情图
        'peopleBug':param.peopleBug, //购买人数
        'url': param.url, // 购买链接
        'taoCode':param.taoCode, //淘口令
        'des': param.des, //推荐理由
        'updateTime': util.dataFormat(new Date()),
    };
    productModel.update({ '_id': _id }, data, function(err, results) {
        res.status(200).json({
            'code': '1',
            'data': results
        });
    });
}

/**
 * 删除首页商品
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.del = function(req, res, next) {
    var param = req.query || req.params;
    var data = {
        '_id': param.id
    };
    productModel.remove(data, function(err, results) {
        res.status(200).json({
            'code': '1',
            'data': results
        });
    });
}





