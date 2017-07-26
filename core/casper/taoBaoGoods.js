phantom.outputEncoding = "UTF-8";
var count = 1;

// 页面抓取数据

// var data = {
//   'picUrl':'', //商品图片
//   'title': '', // 标题
//   'coupon': '', // 优惠券价格
//   'couponStartFee':''  // 满多少可以使用优惠券
//   'couponNumber': '', // 优惠券数量
//   'commissionPercent': '', //
//   'commission': '', //佣金价格
//   'shopTitle': '', //卖家店铺
//   'sales': '', //销量
//   'reservePrice': '',//原价格
//   'zkPrice':'',// 价格
//   'couponEffectiveStartTime':''//优惠价开始时间
//   'couponEffectiveEndTime':'' //优惠价结束时间
//   'url':'',店铺链接
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
    

    this.waitForSelector('#J_QRCodeImg', function() {
        //获取登录二维码
        var loginCode = this.evaluate(function() {

            if ( !document.getElementById('J_QRCodeImg').getElementsByTagName('img')[0] ){
                document.getElementById('J_Quick2Static').click();
                document.getElementById('J_Static2Quick').click();
            }
            
            var code = document.getElementById('J_QRCodeImg').getElementsByTagName('img')[0].getAttribute('src')
            __utils__.sendAJAX('http://192.168.1.100:3001/taohuihui/public/sendEmail', 'post', {
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
        this.echo('登录成功!')
        //获取一页商品数
        var category = [{'title':'男装'}];
        var len = category.length;
        var urls = [];

        for (var j = 0; j < len; j++){
            for (var i = 1; i <= 99; i++) {
                var cat = encodeURI(category[j].title);
                urls.push('http://pub.alimama.com/promo/search/index.htm?q='+ cat +'&_t='+ new Date().getTime() +'&toPage=' + i + '&perPageSize=40&dpyhq=1')
            }
        }
        
        //打开多少个页面
        async.mapLimit(urls, 1, function(url, callback) {
            console.log(url)
            page(url, callback)
        }, function(err, result) {
            casper.exit()
        });


    });

});

// 要抓取的页面
function page(url, callback) {
    casper.options.waitTimeout = 10000;
    casper.options.onWaitTimeout = function() {
        page(url, callback)
    };
    casper.open(url);
    casper.then(function() {
        
        this.waitForSelector('.box-btn-left', function() {

            //获取一页商品数
            var size = this.evaluate(function(num) {
                return $('.box-btn-left').size()
            })

            var _this = this;
            var numArr = [];

            for (var i = 0; i < size; i++) {
                numArr.push(i);
            }


            
            var pageData = this.evaluate(function() {
                function getQueryString(key) {
                    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
                    var result = window.location.search.substr(1).match(reg);
                    return result ? decodeURIComponent(result[2]) : null;
                }
                var category = encodeURI(getQueryString('q'));
                return __utils__.sendAJAX('http://pub.alimama.com/items/search.json?q='+ category +'&toPage='+ getQueryString('toPage') +'&perPageSize=40&dpyhq=1&shopTag=yxjh,dpyhq&t=' + new Date().getTime(), 'get',false);
                
            })

            var pageData = JSON.parse(pageData).data.pageList;

            async.mapLimit(numArr, 1, function(num, callback2) {
                console.log(num)
                core(_this, num, pageData, callback2)
            }, function(err, result) {
                _this.evaluate(function(result) {
                    return __utils__.sendAJAX('http://192.168.1.100:3001/taohuihui/goods/add', 'post', {
                        'data': JSON.stringify(result),
                    }, false);
                }, result)


                _this.echo(JSON.stringify({
                    'count': count++
                })) // 获取页面全部商品数据
            });

        });

    })

    casper.then(function() {

        callback()
    })
}


casper.run()

function core(casper, num, pageData, callback2) {
    var params = {};
    var _this = casper;

    //点击页面立即推广
    _this.options.waitTimeout = 10000;
    _this.options.onWaitTimeout = function() {
        console.log('超时:　' + 　num)
        core(casper, num, pageData, callback2);
    }
    async.series([
        function(cb) {
            _this.wait(1000, function() {
                var data = _this.evaluate(function(num,pageData) {
                    function getQueryString(key) {
                        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
                        var result = window.location.search.substr(1).match(reg);
                        return result ? decodeURIComponent(result[2]) : null;
                    }
                    $('a.box-btn-left').eq(num).trigger('click');

                    // var picUrl = $('.search-box-img img').eq(num).attr('src');
                    // var title = $('a.content-title').eq(num).attr('title');
                    // var coupon = $('.money').eq(num).find('span').text();
                    // var couponNumber = $('.content-line .valign-m span').eq(num).text();
                    // var commissionPercent = $('.commission-field .number').eq(num).text();
                    // var commission = $('.commission-tip:hidden').eq(num).text().replace('￥', '');
                    // var shopTitle = $('.shop-title > span > a > span').eq(num).text();
                    // var sales = $('.content-line .fr .color-d span').eq(num).text();
                    // var remainDays = $('.time-left span').eq(num).text();
                    // var channel = $('.box-shop-info').eq(0).find('.tag-tmall').attr('title') ? '天猫' : '淘宝';
                    // var category = getQueryString('q')

                    var data = {
                        'picUrl': pageData[num].pictUrl.toString(), //商品图片
                        'title':  pageData[num].title.toString(), // 标题
                        'coupon': pageData[num].couponAmount.toString(), // 优惠券价格
                        'couponStartFee':pageData[num].couponAmount.toString(), // 满多少可以使用优惠券
                        'couponNumber': pageData[num].couponLeftCount.toString(), // 优惠券数量
                        'commissionPercent': pageData[num].tkRate.toString(), //佣金百分比
                        'commission': pageData[num].tkCommFee.toString(), //佣金价格
                        'shopTitle': pageData[num].shopTitle.toString(), //卖家店铺
                        'sales': pageData[num].biz30day.toString(), //销量
                        'reservePrice':pageData[num].reservePrice.toString(), //原价格
                        'zkPrice': pageData[num].zkPrice.toString(), // 价格
                        'couponEffectiveStartTime':  pageData[num].couponEffectiveStartTime.toString(), //优惠价开始时间
                        'couponEffectiveEndTime':  pageData[num].couponEffectiveEndTime.toString(), //优惠价结束时间
                        'channel': pageData[num].userType == 1 ? '天猫' : '淘宝', //渠道
                        'category':  getQueryString('q')
                    }

                    return data

                }, num,pageData)

                for (var d in data) {
                    params[d] = data[d]
                }

                // _this.wait(1000, function() {
                _this.waitForSelector('.dropdown-toggle', function() {
                    cb(null, params)
                })
                // })
            })
        },
        function(cb) {
            //点击设置推广位确认键
            _this.wait(1000, function() {

                _this.evaluate(function() {
                    $('.dialog-ft button.btn-brand').eq(0).trigger('click');
                    return $('.dialog-ft button.btn-brand').length
                })

                _this.wait(1000, function() {
                    _this.waitForSelector('.clipboard-wrap', function() {
                        //商品链接&领券链接

                        var data = _this.evaluate(function() {
                            var url = $('#clipboard-target-1').val();
                            var couponUrl = $('#clipboard-target-2').val();
                            var data = {
                                'url': url.toString() || '', //商品链接
                                'couponUrl': couponUrl.toString() || '', //领券链接
                            }
                            //点击淘口令
                            $('.tab-nav li:eq(3)').trigger('click');
                            return data
                        })

                        for (var d in data) {
                            params[d] = data[d]
                        }

                        _this.wait(1000, function() {

                            _this.waitForSelector('.clipboard-wrap', function() {
                                var data = _this.evaluate(function() {
                                    var goodsCode = $('#clipboard-target-1').val();
                                    var couponCode = $('#clipboard-target-2').val();
                                    var data = {
                                        'couponCode': couponCode.toString() || '', //领券口令
                                        'goodsCode': goodsCode.toString() || '', //商品口令
                                    }
                                    return data
                                });


                                for (var d in data) {
                                    params[d] = data[d]
                                }

                                cb(null, params)
                            })


                        })
                    })

                })

            })
        }
    ], function(err, results) {
        console.log(JSON.stringify(results))
        callback2(null, results[0])
    })
}