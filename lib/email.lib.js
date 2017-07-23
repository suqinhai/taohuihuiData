/**
 *
 * @Description 邮件发送 
 * 调用方法:sendMail('amor_zhang@qq.com','这是测试邮件', 'Hi Amor,这是一封测试邮件');
 * @Author Amor
 * @Created 2016/04/26 15:10
 * 技术只是解决问题的选择,而不是解决问题的根本...
 * 我是Amor,为发骚而生!
 *
 */

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../config/email.config.js');

var transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
});


exports.mailOptions = function(html,title,toEmail) {

    var mailOptions = {
        from: config.email.user, // 发送者  
        to: toEmail, // 接受者,可以同时发送多个,以逗号隔开  
        subject: title, // 标题  
        //text: 'Hello world', // 文本  
        html: html,
        // attachments: [{
        //         filename: 'package.json',
        //         path: './package.json'
        //     },
        //     {
        //         filename: 'content',
        //         content: '发送内容'
        //     }
        // ]
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log('邮件发送成功');
        }
        smtpTransport.close(); // 如果没用，关闭连接池

    });
}