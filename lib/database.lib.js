'use strict';

var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var dataConfig = require('../config/database.config.js');

/**
 * 使用 bluebird 诺言库
 */
mongoose.Promise = require('bluebird');

var database = {
    connect: function(callback) {
        mongoose.connect('mongodb://' + dataConfig.host + ':' + dataConfig.port + '/' + dataConfig.db, {
            user: dataConfig.user,
            pass: dataConfig.pass
        }, function(err) {
            if (err) {
                console.log('数据连接出错。。。！')
                err.type = 'database';
                return callback(err);
            }
            console.log('数据连接成功！')
            callback();
        });
    },
}

database.connect(function() {})

module.exports = database;
