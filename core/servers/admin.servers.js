'use strict';
const adminModel = require('../models/admin.model.js');

exports.find = function(options, callback) {
    var query = {};

    if (options.user) { query.user = options.user };
    if (options.password) { query.password = options.password };

    userModel.find(query)
        .exec(function(err, users) {
            callback(err, users);
        });
}
