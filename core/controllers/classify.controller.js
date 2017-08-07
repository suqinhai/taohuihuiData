'use strict';
const _ = require('lodash');
const util = require('../util/util.js');
const classifyModel = require('../models/classify.model.js');
const thirdPropertyModel = require('../models/thirdProperty.model.js');


/**
 * 获取前台分类
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.getClassify = async function(req, res, next) {
    var param = req.query || req.params
    var page = parseInt((param.page ? param.page : 1));
    var pageSize = parseInt((param.pageSize ? param.pageSize : 30));
    var data = {};
    param.name ? data.name = new RegExp(param.name) : '';

    var count = await classifyModel.count({})
        .exec(function(err, count) {
            err ? res.send(err) : '';
            return count
        })

    classifyModel.find(data)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select('name url sort publish thirdPropertyIds thirdPropertyNames createTime updateTime')
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
 * 获取分类
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.get = async function(req, res, next) {
    var param = req.query || req.params
    var page = parseInt((param.page ? param.page : 1));
    var pageSize = parseInt((param.pageSize ? param.pageSize : 30));
    var data = {};
    param.name ? data.name = new RegExp(param.name) : '';

    var count = await classifyModel.count({})
        .exec(function(err, count) {
            err ? res.send(err) : '';
            return count
        })

    classifyModel.find(data)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select('name url sort publish thirdPropertyIds thirdPropertyNames createTime updateTime')
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
 * 添加分类
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.add = async function(req, res, next) {

    req.checkBody({
        'name': {
            notEmpty: {
                options: [true],
                errorMessage: 'name 不能为空'
            }
        },
        'url': {
            notEmpty: {
                options: [true],
                errorMessage: 'url 不能为空'
            }
        },
        'sort': {
            notEmpty: {
                options: [true],
                errorMessage: 'sort 不能为空'
            },
            isNumber: { errorMessage: 'sort 需为number类型' }
        },
        'thirdPropertyIds': {
            notEmpty: {
                options: [true],
                errorMessage: 'thirdPropertyIds 不能为空'
            },
            isArray: { errorMessage: 'thirdPropertyIds 需为Array类型' }
        },
    })

    if (req.validationErrors()) {
        return res.status(400).json({
            'code': '0',
            'data': req.validationErrors()
        });
    }

    var param = req.body;
    var thirdPropertyNames = await thirdPropertyModel.find({ '_id': { $in: param.thirdPropertyIds } });

    param.thirdPropertyNames = _.chain(thirdPropertyNames).map(function(chr) {
        return chr.name;
    });

    var data = {
        'name': param.name,
        'url': param.url,
        'sort': parseInt(param.sort),
        'thirdPropertyIds': param.thirdPropertyIds,
        'thirdPropertyNames': param.thirdPropertyNames,
        'createTime': util.dataFormat(new Date()),
        'updateTime': util.dataFormat(new Date()),
    };

    classifyModel.create(data, function(err, results) {
        err ? res.send(err) : '';
        res.status(200).json({
            'code': '1',
            'data': 'ok'
        });
    })

}

/**
 * 修改分类
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.modify = async function(req, res, next) {

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
        'url': {
            notEmpty: {
                options: [true],
                errorMessage: 'url 不能为空'
            }
        },
        'sort': {
            notEmpty: {
                options: [true],
                errorMessage: 'sort 不能为空'
            },
            isNumber: { errorMessage: 'sort 需为number类型' }
        },
        'thirdPropertyIds': {
            notEmpty: {
                options: [true],
                errorMessage: 'sort 不能为空'
            },
            isArray: { errorMessage: 'sort 需为Array类型' }
        },
    })

    if (req.validationErrors()) {
        return res.status(400).json({
            'code': '0',
            'data': req.validationErrors()
        });
    }

    var param = req.body;
    var _id = param._id;
    var thirdPropertyNames = await thirdPropertyModel.find({ '_id': { $in: param.thirdPropertyIds } });

    param.thirdPropertyNames = _.chain(thirdPropertyNames).map(function(chr) {
        return chr.name;
    });

    var data = {
        'name': param.name,
        'url': param.url,
        'sort': parseInt(param.sort),
        'thirdPropertyIds': param.thirdPropertyIds,
        'thirdPropertyNames': param.thirdPropertyNames,
        'updateTime': util.dataFormat(new Date())
    };

    classifyModel.update({ '_id': _id }, data, function(err, results) {
        err ? res.send(err) : '';
        res.status(200).json({
            'code': '1',
            'msg': 'ok'
        });
    })
}

/**
 * 删除分类
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

    classifyModel.remove(data)
        .exec(function(err, data) {
            err ? res.send(err) : '';
            res.status(200).json({
                'code': '1',
                'msg': 'ok'
            });
        })
}

/**
 *  上线分类
 * 
 * @Author   suqinhai
 * @DateTime 2017-08-03
 * @QQ       467456744
 * @return   {[type]}        [description]
 */
exports.upClassify = async function(req, res, next) {
    req.checkBody({
        '_ids': {
            notEmpty: {
                options: [true],
                errorMessage: '_ids 不能为空'
            },
            isArray: { errorMessage: '_ids 需为数组' }
        },

    })
    var param = req.body
    var data = { 'publish': 1, }
    var _ids = param._ids
    classifyModel.update({ '_id': { $in: _ids } }, data, { 'multi': true }, function(err, results) {
        err ? res.send(err) : '';
        res.status(200).json({
            'code': '1',
            'msg': results
        });
    })
}


/**
 *  下线分类
 * 
 * @Author   suqinhai
 * @DateTime 2017-08-03
 * @QQ       467456744
 * @return   {[type]}        [description]
 */
exports.downClassify = async function(req, res, next) {
    req.checkBody({
        '_ids': {
            notEmpty: {
                options: [true],
                errorMessage: '_ids 不能为空'
            },
            isArray: { errorMessage: '_ids 需为数组' }
        },

    })
    var param = req.body
    var data = { 'publish': 0, }
    var _ids = param._ids
    classifyModel.update({ '_id': { $in: _ids } }, data, { 'multi': true }, function(err, results) {
        err ? res.send(err) : '';
        res.status(200).json({
            'code': '1',
            'msg': results
        });
    })
}


/**
 * 获取第三方分类下拉
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.getThirdPropertySelect = async function(req, res, next) {
    var data = {};
    var param = req.query
    var page = parseInt((param.page ? param.page : 1));
    var pageSize = parseInt((param.pageSize ? param.pageSize : 30));
    param.name ? data.name = new RegExp(param.name) : '';

    req.checkQuery({
        'classifyId': {
            notEmpty: {
                options: [true],
                errorMessage: 'classifyId 不能为空'
            },
        },
    })

    if (req.validationErrors()) {
        return res.status(400).json({
            'code': '0',
            'data': req.validationErrors()
        });
    }

    var thirdPropertyIds = _.chain(await classifyModel.find({
        '_id': { $nin: [param.classifyId] }
    })).map(function(chr) {
        return chr.thirdPropertyIds.join(',')
    }).value();

    data = { '_id': { $nin: _.union(_.compact(thirdPropertyIds).join(',').split(','), true) } };

    var count = await thirdPropertyModel.count(data)
        .exec(function(err, count) {
            err ? res.send(err) : '';
            return count
        })
        
    thirdPropertyModel.find(data)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select('name url sort createTime updateTime')
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
 * 获取第三方分类
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.getThirdProperty = async function(req, res, next) {
    var param = req.query
    var page = parseInt((param.page ? param.page : 1));
    var pageSize = parseInt((param.pageSize ? param.pageSize : 30));



    if (req.validationErrors()) {
        return res.status(400).json({
            'code': '0',
            'data': req.validationErrors()
        });
    }

    var data = {};

    param.name ? data.name = new RegExp(param.name) : '';

    var count = await thirdPropertyModel.count(data)
        .exec(function(err, count) {
            err ? res.send(err) : '';
            return count
        })

    thirdPropertyModel.find(data)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select('name url sort createTime updateTime')
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
 * 添加第三方分类
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.addThirdProperty = function(req, res, next) {

    req.checkBody({
        'name': {
            notEmpty: {
                options: [true],
                errorMessage: 'name 不能为空'
            }
        },
        'url': {
            notEmpty: {
                options: [true],
                errorMessage: 'url 不能为空'
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
        'url': param.url,
        'sort': parseInt(param.sort),
        'createTime': util.dataFormat(new Date()),
        'updateTime': util.dataFormat(new Date()),
    };

    thirdPropertyModel.create(data, function(err, results) {
        err ? res.send(err) : '';
        res.status(200).json({
            'code': '1',
            'data': 'ok'
        });
    })

}

/**
 * 修改第三方分类
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.modifyThirdProperty = function(req, res, next) {

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
        'url': {
            notEmpty: {
                options: [true],
                errorMessage: 'url 不能为空'
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
        'url': param.url,
        'sort': parseInt(param.sort),
        'updateTime': util.dataFormat(new Date())
    };

    thirdPropertyModel.update({ '_id': _id }, data, function(err, results) {
        err ? res.send(err) : '';
        res.status(200).json({
            'code': '1',
            'data': 'ok'
        });
    })
}

/**
 * 删除第三方分类
 * @Author   suqinhai
 * @DateTime 2017-07-16
 * @QQ       467456744
 * @return   {[type]}
 */
exports.delThirdProperty = function(req, res, next) {

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

    thirdPropertyModel.remove(data)
        .exec(function(err, data) {
            err ? res.send(err) : '';
            res.status(200).json({
                'code': '1',
                'data': data
            });
        })
}