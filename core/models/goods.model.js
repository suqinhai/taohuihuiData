'use strict';


// 商品表
const util = require('../util/util.js');
const mongoose = require('mongoose');

const goodsSchema = new mongoose.Schema({
    picUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    coupon: {
        type: String,
        required: true
    },
    commissionPercent: {
        type: String,
        required: true
    },
    commission: {
        type: String,
        required: true
    },
    shopTitle: {
        type: String,
        required: true
    },
    sales: {
        type: String,
        required: true
    },
    remainDays: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    couponUrl: {
        type: String,
        required: true
    },
    couponCode: {
        type: String,
        required: true
    },
    goodsCode: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    createTime:{
        type: String,
        default:util.dataFormat(new Date()),
        required: false
    },
    updateTime:{
        type: String,
        default:util.dataFormat(new Date()),
        required: false
    },
}, {
    collection: 'tb_goods',
    id: false
});

module.exports = mongoose.model('Goods', goodsSchema);
