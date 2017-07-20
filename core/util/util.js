'use strict';

/**
 * 将时间转成日期格式  'yyyy-MM-dd HH:mm:ss'
 * @Author   suqinhai
 * @DateTime 2017-07-17
 * @QQ       467456744
 * @param {[String]} format 格式 
 * @param {[Number]} timestamp 要格式化的时间 默认为当前时间 
 * @return {[String]}   格式化的时间字符串 
 */
exports.dataFormat = function(t, format) {
	format ? '' : format = 'yyyy-MM-dd HH:mm:ss';
    var tf = function(i) { return (i < 10 ? '0' : '') + i };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    });
}

/**
 * 字符串md5加密
 * @Author   suqinhai
 * @Contact  467456744@qq.com
 * @DateTime 2017-07-17
 * @param    {[param]}         param [String]
 * @return   {[type]}            
 */
const crypto = require('crypto');
const fs = require('fs');
exports.md5 = function(param) {
    //crypto模块功能是加密并生成各种散列,此处所示为MD5方式加密
    var md5 = crypto.createHash('md5');   
    return md5.update(param).digest('hex');
}

/**
 * @Author   suqinhai
 * @Contact  467456744@qq.com
 * @DateTime 2017-07-17
 * @param    {[Obejct]}         file [文件stream流]
 * @return   {[type]}           
 */
exports.md5File = function(file) {
    var md5File
    var hash = crypto.createHash('md5');

    file.on('data', function(chunk){
        hash.update(chunk)
    });

    return new Promise(function(resolve, reject) {
        file.on('end', function () {
           resolve(hash.digest('hex').toUpperCase());
        });
    })
}



