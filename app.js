/**
 * Module dependencies
 */

var express = require('express'),
  http = require('http'),
  path = require('path'),
  routing = require('./routing'),
  session = require('express-session'),
  Grant = require('grant-express'),
  app = module.exports = express(),
  grant,
  resources = path.join(__dirname, './');

/**
 * Configuration
 */
grant = new Grant({
  "server": {
    "protocol": "http",
    "host": "localhost:3000",
    "callback": "/callback",
    "transport": "session",
    "state": true
  },
  "foursquare": {
    "key": "ODEENXKRFLRJ0T0X3XXFIIXD2G0CIDDF00GDQCEEB3BE52UE",
    "secret": "H1XFXV3BQZHGCEVAGERYG0VPOVYOSM4JHOZBUTTZZNYLUVHM",
    "scope": "[read]",
    "callback": "/foursquare/callback"
  }
});

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.static(resources));
app.use(session({secret: 'grant'}));
app.use(grant);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-API-KEY");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return next();
});

/**
 * Public Routes
 */
app.get('/', function (req, res) {
  var pathPage = __dirname + "/index.html";
  routing(req, res, pathPage);
});

app.get('/foursquare/tip', function (req, res) {
  var state = (Math.floor(Math.random() * 999999) + 1);
  res.redirect('/connect/foursquare?state=' + state);
});
/**
 * Private Routes
 */
app.get('/foursquare/callback', function (req, res) {
  console.log('This is the response from foursquare :', arguments);
});
/**
 * Start Server
 */
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

