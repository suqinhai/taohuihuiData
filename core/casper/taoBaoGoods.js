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
  verbose: false // log messages will be printed out to the console
});

casper.options.waitTimeout = 1000000;
casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36')


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
      return document.getElementById('J_QRCodeImg').getElementsByTagName('img')[0].getAttribute('src')
    })

    this.echo(loginCode)
  });


  //判断是否登录  条件：登录跳转index.htm
  this.waitForUrl(/index\.htm$/, function() {
    this.echo('登录成功!')
      //获取一页商品数

    var urls = [];

    for (var i = 1; i <= 10; i++) {
      urls.push('http://pub.alimama.com/promo/item/channel/index.htm?q=%E9%9B%B6%E9%A3%9F&channel=qqhd&_t=1497971178095&toPage=' + i + '&dpyhq=1')
    }

    //打开多少个页面
    async.mapLimit(urls, 1, function(url, callback) {
      page(url, callback)
    }, function(err, result) {

    });


  });

});

// 要抓取的页面
function page(url, callback) {

  casper.open(url);
  casper.then(function() {

    this.waitForSelector('.box-btn-left', function() {

      //获取一页商品数
      var size = this.evaluate(function(num) {
        return $('.box-btn-left').size()
      })

      var _this = this;
      var numArr = [];

      for (var i = 0; i < 2; i++) {
        numArr.push(i);
      }

      async.mapLimit(numArr, 1, function(num, callback2) {
        core(_this, num, callback2)
      }, function(err, result) {

        _this.evaluate(function(result) {
          return __utils__.sendAJAX('http://192.168.1.101:3000/goods/add', 'post', {
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
    this.clearMemoryCache(); // 清除了缓存。
    callback()
  })
}


casper.run()

function core(casper, num, callback2) {
  var params = {};
  var _this = casper;
  //点击页面立即推广
  async.series([
    function(cb) {
      _this.wait(300, function() {
        var data = _this.evaluate(function(num) {
          function getQueryString(key) {
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
            var result = window.location.search.substr(1).match(reg);
            return result ? decodeURIComponent(result[2]) : null;
          }
          $('a.box-btn-left').eq(num).trigger('click');

          var picUrl = $('.search-box-img img').eq(num).attr('src');
          var title = $('a.content-title').eq(num).attr('title');
          var coupon = $('.money').eq(num).find('span').text();
          var couponNumber = $('.content-line .valign-m span').eq(num).text();
          var commissionPercent = $('.commission-field .number').eq(num).text();
          var commission = $('.commission-tip:hidden').eq(num).text().replace('￥', '');
          var shopTitle = $('.shop-title > span > a > span').eq(num).text();
          var sales = $('.content-line .fr .color-d span').eq(num).text();
          var remainDays = $('.time-left span').eq(num).text();
          var channel = $('.box-shop-info').eq(0).find('.tag-tmall').attr('title') ? '天猫' : '淘宝';
          var category = getQueryString('q')

          var data = {
            'picUrl': picUrl.toString() || '', //商品图片
            'title': title.toString() || '', // 标题
            'coupon': coupon.toString() || '', // 优惠券价格
            'couponNumber': couponNumber.toString() || '', // 优惠券数量
            'commissionPercent': commissionPercent.toString() || '', //佣金百分比
            'commission': commission.toString() || '', //佣金价格
            'shopTitle': shopTitle.toString() || '', //卖家店铺
            'sales': sales.toString() || '', //销量
            'channel': channel.toString() || '',
            'remainDays': remainDays.toString() || '', //剩余天数
            'channel': channel.toString() || '', //渠道
            'category': category.toString() || ''
          }

          return data

        }, num)

        for (var d in data) {
          params[d] = data[d]
        }

        _this.waitForSelector('.dropdown-toggle', function() {
          cb(null, params)
        })
      })
    },
    function(cb) {
      //点击设置推广位确认键
      _this.wait(300, function() {
        _this.evaluate(function() {
          $('.dialog-ft button.btn-brand').eq(0).trigger('click');
          return $('.dialog-ft button.btn-brand').length
        })


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
    }
  ], function(err, results) {

    callback2(null, results)
  })
}
