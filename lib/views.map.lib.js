'use strict';

var express = require('express');
var glob    = require('glob');
var path    = require('path');
var router  = express.Router();

//获取所以视图

glob.sync('./core/views/**/*.html').forEach(file => {

  var urlPath = file.replace(/\.[^.]*$/, '').replace('./core/views', '');
  var urlArr  = urlPath.split("");
  var urlLen  = urlArr.length;

  // 注册路由视图默认访问index

  if( urlPath.substr(urlLen-5) == 'index'){
  	router.get( urlPath.substr(0,urlLen-5) ,(req, res, next) => {
  		res.render(urlPath.replace('/', ''));
  	});
  }

  // 注册路由路径

  router.get( urlPath , (req, res, next) => {
  		res.render(urlPath.replace('/', ''));
  });

});

module.exports = router;



