'use strict';

var path = require("path");
var spawn = require("child_process").spawn;
var goodsModel = require('../models/goods.model.js');

var goods = {
    get: function(req, res, next) {
        
        // var data = {};
        goods.starCasper()
        res.send('11');
        
            //     console.log(typeof data  + '--------')
            //     // var data = JSON.parse(data);

        //     // goodsModel.find(data)
        //     //     .exec(function(err, results) {
        //     //         res.send(results);
        //     //     })
        // });
    },

    // 添加
    add: function(req, res, next) {

        var param = req.body;
        goodsModel.create(JSON.parse(param.data), function(err, results) {
            if (err){
                console.log('出错')
            }
            // console.log(results)
        });
    },

    // 启动casperjs线程
    starCasper: function(fn) {
        var _this = this; 
        var child = spawn('casperjs', ['./core/casper/taoBaoGoods.js']);
        
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
    },
}

module.exports = goods;
