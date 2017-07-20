'use strict';
const mongoose = require('mongoose');

const navSchema = new mongoose.Schema({
	'name':{
		type: String,
		required: true
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
    collection: 'tb_nav',
    id: false
});

module.exports = mongoose.model('Nav', navSchema);