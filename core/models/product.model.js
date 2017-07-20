'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	type:{
		type: String,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	simg:{
		type: String,
		required: true
	},
	bimg:{
		type: String,
		required: true
	},
	price:{
		type: String,
		required: true
	},
	param1:{
		type: String,
		required: true
	},
	param2:{
		type: String,
		required: true
	},
	param3:{
		type: String,
		required: true
	}
}, {
    collection: 'tb_product',
    id: false
});

module.exports = mongoose.model('Product', userSchema);