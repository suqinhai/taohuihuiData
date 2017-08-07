'use strict';
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
	'name':{
		type: String,
		required: true
	},
	'url':{
		type: String,
		required: true
	},
	'sort':{
		type: Number,
		required: true
	},
	'classifyId':[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Classify',
		required: true
	}],
	'createTime':{
		type: String,
		required: false,
	},
	'updateTime':{
		type: String,
		required: false,
	},
}, {
    collection: 'tb_property',
    id: false
});

module.exports = mongoose.model('Property', propertySchema);