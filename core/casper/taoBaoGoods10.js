phantom.outputEncoding = "UTF-8";
var count = 1;

// 页面抓取数据

// var data = {
//   'picUrl':'', //商品图片
//   'title': '', // 标题
//   'coupon': '', // 优惠券价格
//   'couponNumber': '', // 优惠券数量
//   'commissionPercent': '', //佣金百分比
//   'commission': '', //佣金价格
//   'shopTitle': '', //卖家店铺
//   'sales': '', //销量
//   'remainDays': '', //剩余天数
//   'url': '', //商品链接
//   'couponUrl': '', //领券链接
//   'couponCode': '', // 领券口令
//   'goodsCode': '', //领券口令
//   'channel': '', // 渠道
//   'category':'', //类别
// }

var async = require('./includes/async.js');
// var socket = require('./includes/socket.io.js');
var casper = require('casper').create({
    clientScripts: [
        //'../includes/jquery-2.2.4.js' // These two scripts will be injected in remote
    ],
    pageSettings: {
        loadImages: false, // The WebPage instance used by Casper will
        loadPlugins: false, // use these settings
    },
    logLevel: "info", // Only "info" level messages will be logged
    verbose: false, // log messages will be printed out to the console
});

casper.options.waitTimeout = 900000;
// casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36')


var params = {
    loginUrl: 'https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&css_style=alimama&from=alimama&redirectURL=http%3A%2F%2Fwww.alimama.com&full_redirect=true&disableQuickLogin=true', // 登录地址
}

casper.start();

casper.open(params.loginUrl);

casper.then(function() {
    //获取浏览器当前url
    var url = this.evaluate(function() {
        return window.location.href
    })

    this.waitForSelector('.qrcode-img img', function() {
        //获取登录二维码
        var loginCode = this.evaluate(function() {

            if (!document.getElementById('J_QRCodeImg').getElementsByTagName('img')[0]) {
                document.getElementById('J_Quick2Static').click();
                document.getElementById('J_Static2Quick').click();
            }

            var code = document.getElementById('J_QRCodeImg').getElementsByTagName('img')[0].getAttribute('src')
            __utils__.sendAJAX('http://192.168.1.101:3001/taohuihui/public/sendEmail', 'post', {
                'text': '淘宝联盟登录二维码',
                'url': 'http:' + code,
                'title': '淘宝联盟登录二维码',
                'toEmail': '467456744@qq.com'
            }, false);
            return code
        })

        console.log(loginCode)

    });



    //判断是否登录  条件：登录跳转index.htm
    this.waitForUrl(/index\.htm$/, function() {
        this.options.waitTimeout = 5000;
        this.echo('登录成功!');

        var datas = [];
         var category = ['女装','男装','鞋包','珠宝配饰','运动户外','美妆','母婴','食品','内衣','数码','家装','家具用品','家电','汽车','生活用品','图书音像','其他']; // 要爬取的类目
        var maxPage = 25;  // 最大页面
        var minPage = 1;  // 从第几页开始
        var perPageSize = 40; // 一次返回最大多少条数据
        
        minPage < 1 ? (minPage = 1) : '';
        for (var c in category ){
            for (var page = minPage; page < maxPage; page++ ){
                datas.push({
                    'category':category[c],
                    'toPage':page,
                    'perPageSize':perPageSize,
                })
            }
        }

        async.mapLimit(datas, 1, function(data, callback) {
             var category = data.category;
             var toPage = data.toPage;
             var perPageSize = data.perPageSize;
             console.log(new Date().getTime())
             pageCb(category,toPage,perPageSize,callback)
        }, function(err, result) {
             casper.exit();
        });
    
    });

});

casper.run()


function pageCb(category,toPage,perPageSize,callback){

    casper.options.onWaitTimeout = function() {
        pageCb(category,toPage,callback)
    };

    var items = casper.evaluate(function(category, toPage,perPageSize) {
        var searchData = __utils__.sendAJAX('http://pub.alimama.com/items/search.json?q=' + encodeURI(category) + '&toPage=' + toPage + '&perPageSize='+ perPageSize +'&dpyhq=1&shopTag=yxjh,dpyhq&t=' + new Date().getTime(), 'get', false);
        var data = JSON.parse(searchData);
        var items = data.data.pageList
        return items
    }, category, toPage,perPageSize);


    var newSelfAdzone2Data = casper.evaluate(function(items) {
        var newSelfAdzone2Url = 'http://pub.alimama.com/common/adzone/newSelfAdzone2.json?tag=29&itemId=' + items[0]['auctionId'] + '&t=' + new Date().getTime()
        var newSelfAdzone2Data = JSON.parse(__utils__.sendAJAX(newSelfAdzone2Url, 'get', false));
        return newSelfAdzone2Data
    },items);


    async.mapLimit(items, 1, function(item, callback2) {
        itemCb(casper,item,newSelfAdzone2Data,callback2)
    }, function(err, result) {
        //发送数据服务端
        var data = [];
        for (var r in result){
            var d = {};
            d['auctionId'] = result[r] ? result[r].auctionId : '' // 商品ID
            d['auctionUrl'] = result[r] ? result[r].auctionUrl : '' // 跳转链接:
            d['biz30day'] = result[r] ? result[r].biz30day : '' // 30天销售量
            d['clickUrl'] = result[r] ? result[r].clickUrl  : ''// 商品长链接
            d['couponAmount'] = result[r] ? result[r].couponAmount  : ''//优惠券金额
            d['couponEffectiveEndTime'] = result[r] ? result[r].couponEffectiveEndTime  : '' //优惠券结束时间
            d['couponEffectiveStartTime'] = result[r] ? result[r].couponEffectiveStartTime  : '' //优惠券开始时间
            d['couponInfo'] = result[r] ? result[r].couponInfo  : '' //优惠价信息
            d['couponLeftCount'] = result[r] ? result[r].couponLeftCount : '' // 优惠券剩余张数
            d['couponLink'] = result[r] ? result[r].couponLink : '' //优惠券长链接
            d['couponLinkTaoToken'] = result[r] ? result[r].couponLinkTaoToken  : ''// 优惠券淘口令
            d['couponShortLinkUrl'] = result[r] ? result[r].couponShortLinkUrl  : ''// 优惠券短链接
            d['couponStartFee'] = result[r] ? result[r].couponStartFee  : ''  // 优惠券开始费用
            d['couponTotalCount'] = result[r] ? result[r].couponTotalCount   : ''// 总优惠券数
            d['shopTitle'] = result[r] ? result[r].shopTitle  : ''// 卖家店铺
            d['pictUrl'] = result[r] ? result[r].pictUrl  : ''// 商品图片
            d['taoToken'] = result[r] ? result[r].taoToken  : ''// 商品淘口令
            d['title'] = result[r] ? result[r].title  : ''// 商品标题
            d['tkCommFee'] = result[r] ? result[r].tkCommFee  : ''// 商品佣金
            d['tkRate'] = result[r] ? result[r].tkRate  : ''// 商品佣金百分比
            d['zkPrice'] = result[r] ? result[r].zkPrice  : ''// 商品价格
            d['userType'] = result[r] ? result[r].userType  : 0// 1 天猫 0 淘宝
            d['category'] = category  || ''// 属性
            data.push(d);
        }

        casper.evaluate(function(data) {
            __utils__.sendAJAX('http://192.168.1.101:3001/taohuihui/goods/add', 'post', {
                'data': JSON.stringify(data),
            }, false);
        },data)
        
        casper.wait(5000,function(){
             callback(null,result);
        })
       
    });
}

function itemCb(casper,item,newSelfAdzone2Data,callback2) {

    var itemData = casper.evaluate(function(item,newSelfAdzone2Data) {

        var auctionid = item['auctionId'];
        var adzoneid = newSelfAdzone2Data['data']['otherAdzones'][0]['sub'][0]['id'];
        var siteid = newSelfAdzone2Data['data']['otherAdzones'][0]['id'];

        var getAuctionCodeUrl = 'http://pub.alimama.com/common/code/getAuctionCode.json?auctionid=' + auctionid + '&adzoneid=' + adzoneid + '&siteid=' + siteid + '&scenes=1';
        var getAuctionCode = JSON.parse(__utils__.sendAJAX(getAuctionCodeUrl, 'get', false));

        for (var taoCode in getAuctionCode.data) {
            item[taoCode] = getAuctionCode.data[taoCode]
        }

        return item
    }, item,newSelfAdzone2Data);


    casper.wait(2000,function(){
        callback2(null,itemData)
    })  
}