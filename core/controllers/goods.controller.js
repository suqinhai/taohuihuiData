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
        console.log(JSON.stringify(param.data))
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

         setTimeout(function(){
            var child2 = spawn('casperjs', ['./core/casper/taoBaoGoods2.js']);
            child2.stdout.on('data', function(data) {
                console.log('标准输出: ' + data);
            });
        }, 50000);

        setTimeout(function(){
            var child3 = spawn('casperjs', ['./core/casper/taoBaoGoods3.js']);
            child3.stdout.on('data', function(data) {
                console.log('标准输出: ' + data);
            });
        }, 100000);

        setTimeout(function(){
            var child4 = spawn('casperjs', ['./core/casper/taoBaoGoods4.js']);
            child4.stdout.on('data', function(data) {
                console.log('标准输出: ' + data);
            });
        }, 150000);

        setTimeout(function(){
            var child5 = spawn('casperjs', ['./core/casper/taoBaoGoods5.js']);
            child5.stdout.on('data', function(data) {
                console.log('标准输出: ' + data);
            });
        }, 200000);
        

        setTimeout(function(){
            var child6 = spawn('casperjs', ['./core/casper/taoBaoGoods6.js']);
            child6.stdout.on('data', function(data) {
                console.log('标准输出: ' + data);
            });
        }, 250000);


        setTimeout(function(){
            var child7 = spawn('casperjs', ['./core/casper/taoBaoGoods7.js']);
            child7.stdout.on('data', function(data) {
                console.log('标准输出: ' + data);
            });
        }, 300000);

        setTimeout(function(){
            var child8 = spawn('casperjs', ['./core/casper/taoBaoGoods8.js']);
            child8.stdout.on('data', function(data) {
                console.log('标准输出: ' + data);
            });
        }, 350000);




        setTimeout(function(){
            var child9 = spawn('casperjs', ['./core/casper/taoBaoGoods9.js']);
            child9.stdout.on('data', function(data) {
                console.log('标准输出: ' + data);
            });
        }, 400000);


         setTimeout(function(){
            var child10 = spawn('casperjs', ['./core/casper/taoBaoGoods10.js']);
            child10.stdout.on('data', function(data) {
                console.log('标准输出: ' + data);
            });
        }, 450000);


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
