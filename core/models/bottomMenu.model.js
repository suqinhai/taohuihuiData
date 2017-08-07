'use strict';
const mongoose = require('mongoose');

const bottomMenuSchema = new mongoose.Schema({
	'name':{
		type: String,
		required: true
	},
	'url':{
		type: String,
		required: true
	},
	'actionType':{
		type: String,
		required: true,
		enum:['index','classify','circle','account'] //  index 首页  classify 分类   circle 朋友圈   account 我的账户
	},
	'sort':{
		type: Number,
		required: true
	},
	'createTime':{
		type: String,
		required: false,
	},
	'updateTime':{
		type: String,
		required: false,
	},
}, {
    collection: 'tb_bottomMenu',
    id: false
});

module.exports = mongoose.model('BottomMenu', bottomMenuSchema);