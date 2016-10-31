/**
 * This file is responsible for setting up the Email plugin if any.
 */

var loopback = require('loopback');

module.exports = function (app) {
  if (!process.env.SENDGRID_API_KEY) return;
  var DataSource = require('loopback-datasource-juggler').DataSource;
  var dsSendGrid = new DataSource('loopback-connector-sendgrid', {
    api_key: process.env.SENDGRID_API_KEY
  });
  loopback.Email.attachTo(dsSendGrid);
};