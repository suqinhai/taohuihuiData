'use strict';
/** 
 * 路由配置
 * [exports description]
 * @type {Object}
 */
const project = require('./project.config.js');


const routers = {

    // 后台用户管理路由
    '/admin/register': {
        'post': 'admin.register'
    },
    '/admin/login': {
        'post': 'admin.login'
    },
    '/admin/modifyPassWord': {
        'post': 'admin.modifyPassWord'
    },
    '/admin/logout': {
        'get': 'admin.logout'
    },

    // 后台用户管理路由
    '/user/register': {
        'post': 'user.register'
    },
    '/user/login': {
        'get': 'user.login'
    },
    '/user/modifyPassWord': {
        'post': 'user.modifyPassWord'
    },
    '/user/logout': {
        'post': 'user.logout'
    },


    // 首页头部菜单
    '/nav/get': {
        'get': 'nav.get'
    },
    '/nav/add': {
        'post': 'nav.add'
    },
    '/nav/modify': {
        'post': 'nav.modify'
    },
    '/nav/del': {
        'post': 'nav.del'
    },


    // 首页海报轮播
    '/poster/get': {
        'get': 'poster.get'
    },
    '/poster/add': {
        'post': 'poster.add'
    },
    '/poster/modify': {
        'post': 'poster.modify'
    },
    '/poster/del': {
        'post': 'poster.del'
    },

     //第三方分类管理接口
    '/classify/getThirdPropertySelect': {
        'get': 'classify.getThirdPropertySelect'
    }, 
    '/classify/getThirdProperty': {
        'get': 'classify.getThirdProperty'
    },
    '/classify/addThirdProperty': {
        'post': 'classify.addThirdProperty'
    },
    '/classify/modifyThirdProperty': {
        'post': 'classify.modifyThirdProperty'
    },
    '/classify/delThirdProperty': {
        'post': 'classify.delThirdProperty'
    },


    // 首页底部浮动菜单
    '/bottomMenu/get': {
        'get': 'bottomMenu.get'
    },
    '/bottomMenu/add': {
        'post': 'bottomMenu.add'
    },
    '/bottomMenu/modify': {
        'post': 'bottomMenu.modify'
    },
    '/bottomMenu/del': {
        'post': 'bottomMenu.del'
    },

    '/goods/init2': {
        'get': 'goods.init2'
    },
    '/goods/init': {
        'get': 'goods.init'
    },
    '/goods/get': {
        'get': 'goods.get'
    },
    '/goods/add': {
        'post': 'goods.add'
    },
    '/goods/modify': {
        'post': 'goods.modify'
    },
    '/goods/addDetails': {
        'post': 'goods.addDetails'
    },
    '/goods/verifyId': {
        'post': 'goods.verifyId'
    },

    



    
}

const rs = {};
for (var router in routers){
    rs['/' + project.projectName + router] = routers[router]
}
module.exports = rs
