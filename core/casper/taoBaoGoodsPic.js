phantom.outputEncoding = "UTF-8";
// 页面抓取数据

// var data = {
//   'mainPic':'', //商品图片
//   'detailsPic': '', // 商品详情
//}


var casper = require('casper').create({
  clientScripts: [
    '../includes/jquery.js' // These two scripts will be injected in remote
  ],
  pageSettings: {
    loadImages: true, // The WebPage instance used by Casper will
    loadPlugins: false, // use these settings
  },
  logLevel: "info", // Only "info" level messages will be logged
  verbose: true // log messages will be printed out to the console
});

casper.options.waitTimeout = 1000000;
casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36')


var params = {
  url: 'https://s.click.taobao.com/0ogyShw',
}

casper.start();

casper.open(params.url);

casper.then(function() {
  //获取浏览器当前url
  var url = this.evaluate(function() {
    return window.location.href
  })
  this.scrollTo(0, 2000);

  this.wait(100, function() {
    this.capture('google.png')
    this.waitForSelector('.ke-post img', function() {
      var data = this.evaluate(function() {
        var data = {
          mainPic: [],
          detailsPic: [],
        }
        jQuery('#J_UlThumb li img').each(function() {
          data.mainPic.push(jQuery(this).attr('src').replace('_60x60q90.jpg', '_430x430q90.jpg'))
        });

        jQuery('.ke-post img').each(function() {
          var src = jQuery(this).attr('src')
          if (src.indexOf('T1BYd_XwFcXXb9RTPq-90-90.png') > -1 && jQuery(this).attr('data-ks-lazyload').indexOf('spaceball.gif') == -1) {
            data.detailsPic.push(jQuery(this).attr('data-ks-lazyload'))
          } else if (src.indexOf('T1BYd_XwFcXXb9RTPq-90-90.png') == -1 && src.indexOf('spaceball.gif') == -1) {
            data.detailsPic.push(src)
          } else {

          }
        })

        return data
      });

      console.log(JSON.stringify(data))
    });
  })

});
casper.run();
