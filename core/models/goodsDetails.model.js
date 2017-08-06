'use strict';


// 商品表
const util = require('../util/util.js');
const mongoose = require('mongoose');

const goodsDetailsSchema = new mongoose.Schema({
    goodId:{
        ref: 'Goods',
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    brand: { //品牌直销
        type: String,
        required: false
    },
    popular:{ //超级人气榜
        type: Number,
        required: false
    },
    sellerPromise:{ //卖家承诺
        type: Array,
        required: false
    },
    payMethod:{ //支付方式
        type: Array,
        required: false
    },
    promoType: { //商品广告
        type: String,
        required: false
    },
    goldSellers: { //金牌卖家
        type: Boolean,
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
}, {
    collection: 'tb_goodsDetails',
    id: false
});

module.exports = mongoose.model('GoodsDetails', goodsDetailsSchema);
