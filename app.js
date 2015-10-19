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
  resources = path.join(__dirname, './');

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.static(resources));
app.use(session({secret: 'grant'});
app.use(grant);

/**
 * Routes
 */
app.get('/', function (req, res) {
  var pathPage = __dirname + "/dist";
  routing(req, res, pathPage);
});
/**
 * Start Server
 */
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
