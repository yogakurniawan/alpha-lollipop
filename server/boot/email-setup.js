/**
 * This file is responsible for setting up the Email plugin if any.
 */

var loopback = require('loopback');

module.exports = function (app) {
  if (!process.env.SENDGRID_API_KEY) return;

  var mail = loopback.createDataSource({
    connector: loopback.Mail,
    transports: [{
      type: 'sendgrid',
      auth: {
        api_key: process.env.SENDGRID_API_KEY
      }
    }]
  });

  loopback.User.email.attachTo(mail);
};