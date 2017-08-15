phantom.outputEncoding = "UTF-8";
// 页面抓取数据

// var data = {
//   'mainPic':'', //商品图片
//   'detailsPic': '', // 商品详情
//}


var async = require('./includes/async.js');
var casper = require('casper').create({
    clientScripts: [
        // './core/casper/includes/jquery.js' // These two scripts will be injected in remote
    ],
    pageSettings: {
        loadImages: false, // The WebPage instance used by Casper will
        loadPlugins: false, // use these settings
    },
    logLevel: "info", // Only "info" level messages will be logged
    verbose: false // log messages will be printed out to the console
});

casper.options.waitTimeout = 1000000;
casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36')




casper.start();



core();

function core() {
    var params = {
        url: 'https://www.baidu.com',
    }
    casper.open(params.url);

    casper.then(function() {
        //获取浏览器当前url
        t()

        function t() {
            var data = casper.evaluate(function() {
                return __utils__.sendAJAX('http://172.16.1.56:3001/taohuihui/goods/get', 'get', false);
            })

            var urls = [];
            var data = JSON.parse(data)
            var len = data.list.length;

            if (len == 0) {
                casper.exit()
            }

            for (var i = 0; i < len; i++) {
                urls.push({ 'url': data.list[i].auctionUrl, '_id': data.list[i]._id });
            }

            async.mapLimit(urls, 1, function(url, callback) {
                page(url, callback)
            }, function(err, result) {
                t()
            });
        }

    });
}

function page(url, callback) {
    console.log(url.url)
    casper.options.waitTimeout = 10000;
    casper.options.onWaitTimeout = function() {
        callback(null)
        console.log('出错回调')
    };
    casper.start(url.url, function() {
        this.clearMemoryCache(); // 清除缓存并调用newPage()方法替换当前页面对象。
    });
    casper.then(function() {
        this.wait(1000, function() {
            this.scrollTo(0, 3000);

            var actionUrl = this.evaluate(function() {
                return window.location.href
            })

            if (actionUrl.indexOf('noitem.htm') > 0) {
                callback(null)
                this.capture('google.png')
                return false;
            } else if (actionUrl.indexOf('noitem.htm') == -1) {
                this.wait(1000, function() {
                    this.waitForSelector('.ke-post img', function() {
                        var data = this.evaluate(function(url) {

                            var data = {
                                'goodId': url._id,
                                'mainPic': [],
                                'detailsPic': [],
                            }

                            var li = document.getElementById('J_UlThumb').getElementsByTagName('li');
                            var len = li.length;

                            for (var i = 0; i < len; i++) {
                                var src = li[i].getElementsByTagName('img')[0].getAttribute('src');
                                var index = src.indexOf('.jpg_') + 5;
                                data.mainPic.push(src.substr(0, index) + '430x430.jpg')
                            }

                            if (window.location.href.indexOf('tmall') == -1) {
                                //淘宝详情页抓取
                                var kePost = document.getElementById('J_DivItemDesc');
                                var img = kePost.getElementsByTagName('img');
                                var len = kePost.getElementsByTagName('img').length;

                                for (var i = 0; i < len; i++) {
                                    var width = img[i].getAttribute('width');
                                    if ((width && parseInt(width) > 450) || img[i].getAttribute('align')) {
                                        var lazyload = img[i].getAttribute('data-ks-lazyload');
                                        var src = img[i].getAttribute('src');
                                        if (lazyload) {
                                            data.detailsPic.push(lazyload)
                                        } else if (src) {
                                            data.detailsPic.push(src)
                                        }
                                    }
                                }

                                var brand = ''; // 品牌直销

                                var popular = '' // 天猫收藏人气
                                var J_CollectCount = document.getElementsByClassName('J_FavCount')[0].innerText;
                                var number = /\d+/g;
                                var popular = parseInt(J_CollectCount.match(number)[0]);

                                var sellerPromise = [] // 服务承诺
                                var serPromise = document.getElementsByClassName('tb-extra')[0].getElementsByTagName('dl')[0];
                                var a = serPromise.getElementsByTagName('a');
                                var len = serPromise.getElementsByTagName('a').length;
                                for (var i = 0; i < len; i++) {
                                    sellerPromise.push(a[i].innerText)
                                }

                                var payMethod = [] // 支付方式
                                var credit = document.getElementsByClassName('tb-extra')[0].getElementsByTagName('dl')[1];
                                var a = credit.getElementsByTagName('a');
                                var len = credit.getElementsByTagName('a').length;
                                for (var i = 0; i < len; i++) {
                                    payMethod.push(a[i].innerText)
                                }

                                var goldSellers = false //金牌卖家

                                var promoType = '' // 商品广告
                                if (document.getElementById('J_PromoType')) {
                                    var promoType = document.getElementById('J_PromoType').innerText
                                }

                            } else {
                                //天猫详情页抓取
                                var kePost = document.getElementsByClassName('ke-post')[0];
                                var img = kePost.getElementsByTagName('img');
                                var len = kePost.getElementsByTagName('img').length;

                                for (var i = 0; i < len; i++) {
                                    var align = img[i].getAttribute('align');
                                    if (align || align == 'absmiddle') {
                                        var lazyload = img[i].getAttribute('data-ks-lazyload');
                                        var src = img[i].getAttribute('src');
                                        if (lazyload) {
                                            data.detailsPic.push(lazyload)
                                        } else if (src) {
                                            data.detailsPic.push(src)
                                        }
                                    }

                                }
                                var brand = ''; // 品牌直销
                                if (　document.getElementsByClassName('flagship-icon-font')[0]　) {
                                    var brand = document.getElementsByClassName('flagship-icon-font')[0].innerText;
                                }

                                var popular = '' // 天猫收藏人气
                                var J_CollectCount = document.getElementById('J_CollectCount').innerText;
                                var number = /\d+/g;
                                var popular = parseInt(J_CollectCount.match(number)[0]);

                                var sellerPromise = [] // 服务承诺
                                var serPromise = document.getElementsByClassName('tb-serPromise')[0];
                                var li = serPromise.getElementsByTagName('li');
                                var len = serPromise.getElementsByTagName('li').length;
                                for (var i = 0; i < len; i++) {
                                    sellerPromise.push(li[i].getElementsByTagName('a')[0].innerText)
                                }

                                var payMethod = [] // 支付方式
                                var credit = document.getElementsByClassName('pay-credit')[0];
                                var a = serPromise.getElementsByTagName('a');
                                var len = serPromise.getElementsByTagName('a').length;
                                for (var i = 0; i < len; i++) {
                                    payMethod.push(a[i].innerText)
                                }

                                var goldSellers = '' //金牌卖家
                                if (　document.getElementsByClassName('jinpai-v').length　 == 1) {
                                    goldSellers = true
                                }

                                var promoType = '' // 商品广告
                                if (document.getElementsByClassName('tm-promo-type').length) {
                                    var promoType = document.getElementsByClassName('tm-promo-type')[0].innerText
                                }
                            }

                            data.brand = brand;
                            data.popular = popular;
                            data.sellerPromise = sellerPromise;
                            data.payMethod = payMethod;
                            data.promoType = promoType;
                            data.goldSellers = goldSellers;

                            __utils__.sendAJAX('http://172.16.1.56:3001/taohuihui/goods/modify', 'post', { 'data': JSON.stringify(data) }, false);
                            return data
                        }, url);

                        //console.log(JSON.stringify(data))
                        callback(null, data)
                    });
                })
            }
        })
    })
}

casper.run();