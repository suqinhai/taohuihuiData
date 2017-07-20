'use strict';
const util = require('../util/util.js');
const navModel = require('../models/nav.model.js');

/**
 * 获取首页导航列表
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.get = async function(req, res, next) {
    var param = req.query || req.params
    var page = parseInt((param.page ? param.page : 1));
    var pageSize = parseInt((param.pageSize ? param.pageSize : 15));
    var data = {};
    param.name ? data.name = new RegExp(param.name) : '';

    var count = await navModel.count({})
        .exec(function(err, count) {
            err ? res.send(err) : '';
            return count
        })

    navModel.find(data)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select('name sort createTime updateTime')
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

/**
 * 添加首页导航列表
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.add = function(req, res, next) {

    req.checkBody({
        'name': {
            notEmpty: {
                options: [true],
                errorMessage: 'name 不能为空'
            }
        },
        'sort': {
            notEmpty: {
                options: [true],
                errorMessage: 'sort 不能为空'
            },
            isNumber: { errorMessage: 'sort 需为number类型' }
        }
    })

    if (req.validationErrors()) {
        return res.status(400).json({
            'code': '0',
            'data': req.validationErrors()
        });
    }

    var param = req.body
    var data = {
        'name': param.name,
        'sort': parseInt(param.sort),
        'createTime': util.dataFormat(new Date()),
        'updateTime': util.dataFormat(new Date()),
    };
    navModel.create(data, function(err, data) {
        err ? res.send(err) : '';
        res.status(200).json({
            'code': '1',
            'data': data
        });
    })

}

/**
 * 修改首页导航列表
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.modify = function(req, res, next) {

    req.checkBody({
        '_id': {
            notEmpty: {
                options: [true],
                errorMessage: '_id 不能为空'
            }
        },
        'name': {
            notEmpty: {
                options: [true],
                errorMessage: 'name 不能为空'
            }
        },
        'sort': {
            notEmpty: {
                options: [true],
                errorMessage: 'sort 不能为空'
            },
            isNumber: { errorMessage: 'sort 需为number类型' }
        }
    })

    if (req.validationErrors()) {
        return res.status(400).json({
            'code': '0',
            'data': req.validationErrors()
        });
    }
    var param = req.body
    var _id = param._id
    var data = {
        'name': param.name,
        'sort': parseInt(param.sort),
        'updateTime': util.dataFormat(new Date())
    };
    navModel.update({ '_id': _id }, data, function(err, data) {
        err ? res.send(err) : '';
        res.status(200).json({
            'code': '1',
            'data': data
        });
    })
}

/**
 * 删除首页导航列表
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.del = function(req, res, next) {

    req.checkBody({
        '_ids': {
            notEmpty: {
                options: [true],
                errorMessage: '_ids 不能为空'
            },
            isArray: { errorMessage: '_ids 需为数组' }
        },

    })

    if (req.validationErrors()) {
        return res.status(400).json({
            'code': '0',
            'data': req.validationErrors()
        });
    }

    var param = req.body

    var data = {
        '_id': { $in: param._ids }
    }

    navModel.remove(data)
        .exec(function(err, data) {
            err ? res.send(err) : '';
            res.status(200).json({
                'code': '1',
                'data': data
            });
        })
}