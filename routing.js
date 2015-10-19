var fs = require('fs'),
path = require('path'),
mime = require('mime');

function goToPage(req, res, pathPage) {
  fs.exists(pathPage, function (exists) {
    if (exists) {
      fs.readFile(pathPage, function (err, data) {
        res.writeHead(200, {"Content-Type": mime.lookup(path.basename(pathPage))});
        res.end(data);
      });
    } else {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.end('wrong page');
    }
  });
}
module.exports = goToPage;
