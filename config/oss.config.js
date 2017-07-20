
/**
 * 阿里云oss配置
 * [client description]
 * @type {OSS}
 */
var OSS = require('ali-oss');
var client = new OSS({
  region: 'oss-cn-shanghai',
  accessKeyId: 'LTAIBoUbJWB2HXLG',
  accessKeySecret: 't8biOYMj3GCBEMMInh1Jzr7MSasiIQ',
  bucket: 'bucketdylan'
});

module.exports = client;