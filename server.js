/**
 * Module dependencies
 */

var express = require('express'),
  http = require('http'),
  bodyParser = require('body-parser'),
  https = require('https'),
  path = require('path'),
  config = require('config'),
  routing = require('./routing'),
  session = require('express-session'),
  app = module.exports = express(),
  resources = path.join(__dirname, './');

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.static(resources));
app.use(session({secret: 'grant'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


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

var foursquare =  config.foursquare;
var credentials = 'client_secret=' + foursquare.secret + '&client_id=' + foursquare.id + '&v=' + foursquare.v;

/**
 * Foursquare venues
 */
app.get('/foursquare/venues', function (req, res) {
  var route;
  route = foursquare.url + '/v2/venues/search?' + req.query.positions + '&limit=10&' + credentials;
  var request = https.get(route, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (d) {
      var result = JSON.parse(d).response;
      res.write(JSON.stringify(result));
      res.end();
    });
  });
  request.on('error', function (e) {
    res.write(e);
    res.end();
  });
  request.end();
});

/**
 * Foursquare tip for venue
 */
app.get('/foursquare/tips', function (req, res) {
  var route;
  route = foursquare.url + '/v2/venues/' + req.query.venue_id + '/tips?' + credentials;
  var request = https.get(route, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (d) {
      res.write(d);
      res.end();
    });
  });
  request.on('error', function (e) {
    res.write(e);
    res.end();
  });
  request.end();
});
/**
 * Foursquare tips
 */
app.get('/foursquare/tip', function (req, res) {
  var route;
  route = foursquare.url + '/v2/tips/' + req.query.tip_id + '?' + credentials;
  var request = https.get(route, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (d) {
      res.write(d);
      res.end();
    });
  });
  request.on('error', function (e) {
    res.write(e);
    res.end();
  });
  request.end();
});
/**
 * Start Server
 */
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

