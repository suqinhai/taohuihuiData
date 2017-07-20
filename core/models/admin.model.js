'use strict';

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
	name:{
		type: String,
		required: false
	},
	email:{
		type: String,
		required: false
	},
	user:{
		type: String,
		required: true
	},
	passwd:{
		type: String,
		required: true
	},
	createTime:{
		type: String,
		required: false
	},
	updateTime:{
		type: String,
		required: false
	}
}, {
    collection: 'tb_admin',
    id: false
});

module.exports = mongoose.model('Admin', adminSchema);