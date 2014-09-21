var express = require('express');
var router = express.Router();
var lookup = require('../lib/lookup.js');
var _ = require('lodash');
var fs = require('fs');

/* GET favicon. */
router.get('/favicon.ico', function(req, res) {
   var img = fs.readFileSync('./public/images/favicon.ico');
   res.writeHead(200, {'Content-Type': 'image/x-icon' });
   res.end(img, 'binary');
});

/* GET home page. */
router.get('/', function(req, res) {
  lookup.getIndex()
    .then(function (links) {
      res.render('index', { title: 'Siteswap Zone', links: links });
    });
});

/* Redirect siteswap to imgur. */
router.get('/:ss', function(req, res) {
  var ss = req.params.ss;
  console.log('Looking up siteswap for title:', ss);
  lookup.lookupByTitle(ss)
    .then(function (match) {
      console.log('Lookup for ', ss, ' returned:', match);
      if (_.isObject(match))
          res.redirect(match.link);
      else {
          res.status(404);
      }
    });
});

/* Display siteswap GIF in a local page. */
router.get('/z/:ss', function(req, res) {
  var ss = req.params.ss;
  console.log('Looking up siteswap for title:', ss);
  lookup.lookupByTitle(ss)
    .then(function (match) {
      console.log('Lookup for ', ss, ' returned:', match);
      var imgur = match.link.substr(0, match.link.length-4);
      if (_.isObject(match))
        res.render('onesiteswap', { title: match.title, img: match.link, imgur: imgur });
      else {
          res.status(404);
      }
    });
});

module.exports = router;
