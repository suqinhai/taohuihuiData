/**
 * 服务端session配置
 * [exports description]
 * @type {Object}
 */
module.exports = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  maxAge: 60000*24*30,
  cookie: { secure: false,maxAge: 60000*24*30 }
}