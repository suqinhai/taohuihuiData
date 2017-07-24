'use strict';


// 商品表
const util = require('../util/util.js');
const mongoose = require('mongoose');

const goodsSchema = new mongoose.Schema({
    picUrl: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    coupon: {
        type: String,
        required: false
    },
    couponStartFee: {
        type: String,
        required: false
    },
    couponNumber: {
        type: String,
        required: false
    },
    commissionPercent: {
        type: String,
        required: false
    },
    commission: {
        type: String,
        required: false
    },
    shopTitle: {
        type: String,
        required: false
    },
    sales: {
        type: String,
        required: false
    },
    reservePrice: {
        type: String,
        required: false
    },
    zkPrice: {
        type: String,
        required: false
    },
    couponEffectiveStartTime: {
        type: String,
        required: false
    },
    couponEffectiveEndTime: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    couponUrl: {
        type: String,
        required: false
    },
    couponCode: {
        type: String,
        required: false
    },
    goodsCode: {
        type: String,
        required: false
    },
    channel: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    mainPic: {
        type: Array,
        required: false
    },
    detailsPic: {
        type: Array,
        required: false
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
