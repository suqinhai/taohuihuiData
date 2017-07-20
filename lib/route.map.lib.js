'use strict';

var express      = require('express');
var glob         = require('glob');
var path         = require('path');
var _            = require('lodash');
var requireAll   = require('require-all');
var routerConfig = require('../config/route.config');
var router       = express.Router();

//读取所以控制器

var controllers = requireAll({
  dirname: path.join(__dirname, '../core/controllers/'),
  filter: /(.+)\.controller\.js$/
});


//添加控制方法给路由

var routeControl = (value, key) =>  {

  _.forEach( routerConfig,  (value, key) => {
     var controller;
     var action;
     var route;
     var methods 

     if( _.isString(key) && _.isObject(value) ){
              route =  key;
           _.forEach(value, (value, key)=> {
              controller = value;
              action     = key;
          })
              methods = controllers[controller.split(".")[0]][controller.split(".")[1]]
     }
     
     function errorFuntion(route,methods) {
        if(!methods){ console.log( route + '没有对应的方法' ) } 
     }(route,methods);
     
     router[action](route,methods ? methods: errorFuntion);
  })
}

routeControl();

module.exports = router;




