'use strict';


// 商品表
const util = require('../util/util.js');
const mongoose = require('mongoose');

const goodsSchema = new mongoose.Schema({
    auctionId: {
        type: Number,
        required: false
    },
    auctionUrl: {
        type: String,
        required: false
    },
    biz30day: {
        type: Number,
        required: false
    },
    clickUrl: {
        type: String,
        required: false
    },
    couponAmount: {
        type: Number,
        required: false
    },
    couponEffectiveEndTime: {
        type: String,
        required: false
    },
    couponEffectiveStartTime: {
        type: String,
        required: false
    },
    couponInfo: {
        type: String,
        required: false
    },
    couponLeftCount: {
        type: Number,
        required: false
    },
    couponLink: {
        type: String,
        required: false
    },
    couponLinkTaoToken: {
        type: String,
        required: false
    },
    couponShortLinkUrl: {
        type: String,
        required: false
    },
    couponStartFee: {
        type: Number,
        required: false
    },
    couponTotalCount: {
        type: Number,
        required: false
    },
    shopTitle: {
        type: String,
        required: false
    },
    pictUrl: {
        type: String,
        required: false
    },
    taoToken: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    tkCommFee: {
        type: Number,
        required: false
    },
    tkRate: {
        type: Number,
        required: false
    },
    zkPrice: {
        type: Number,
        required: false
    },
    userType: {
        type: Number,
        required: false
    },
    category: {
        type: Array,
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
    sort: {
        type: Number,
        default:0,
        required: false
    },
    publish: {
        type: Number,
        default:0,
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
