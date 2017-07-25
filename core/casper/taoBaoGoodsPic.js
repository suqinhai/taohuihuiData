phantom.outputEncoding = "UTF-8";
// 页面抓取数据

// var data = {
//   'mainPic':'', //商品图片
//   'detailsPic': '', // 商品详情
//}


var async = require('./includes/async.js');
var casper = require('casper').create({
    clientScripts: [
        './core/casper/includes/jquery.js' // These two scripts will be injected in remote
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
        var data = this.evaluate(function() {
            return __utils__.sendAJAX('http://192.168.1.101:3001/taohuihui/goods/get', 'get', false);
        })

        var urls = [];
        var data = JSON.parse(data)
        var len = data.list.length;

        for (var i = 0; i < len; i++) {
            urls.push({ 'url': data.list[i].url, '_id': data.list[i]._id });
        }

        async.mapLimit(urls, 1, function(url, callback) {
            page(url, callback)
        }, function(err, result) {
            casper.exit()
        });
    });
}

function page(url, callback) {
    casper.open(url.url);
    casper.then(function() {
        this.scrollTo(0, 2000);
        this.wait(500, function() {

            this.waitForSelector('.ke-post img', function() {
                var data = this.evaluate(function(url) {

                    var data = {
                        '_id': url._id,
                        'mainPic': [],
                        'detailsPic': [],
                    }

                    jQuery('#J_UlThumb li img').each(function() {
                        var src = jQuery(this).attr('src');
                        var index = src.indexOf('.jpg_') + 5;
                        data.mainPic.push(src.substr(0, index) + '430x430.jpg')
                    });

                    jQuery('.ke-post img').each(function() {
                        var lazyload = jQuery(this).attr('data-ks-lazyload')
                        var src = jQuery(this).attr('src')

                        if (lazyload) {
                            data.detailsPic.push(jQuery(this).attr('data-ks-lazyload'))
                        } else if (src.indexOf('T1BYd_XwFcXXb9RTPq-90-90.png') == -1 && src.indexOf('spaceball.gif') == -1) {
                            data.detailsPic.push(src)
                        }
                    })

                    __utils__.sendAJAX('http://192.168.1.101:3001/taohuihui/goods/modify', 'post', {'data':JSON.stringify(data)}, false);

                    return data
                }, url);

                // console.log(JSON.stringify(data))
                callback(null, data)
            });
        })
    })
}

casper.run();