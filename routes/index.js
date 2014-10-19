var _ = require('lodash');
var dlog = require('debug')('index');
var express = require('express');
var fs = require('fs');
var lookup = require('../lib/lookup.js');
var router = express.Router();
var util = require('util');

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

router.get('/robots.txt', function(req, res) {
  res.send('User-agent: *\nDisallow: /\n');
});

function notFound(res, ss) {
  res.status(404).send(util.format('Siteswap %s not in index.', ss));
}

/* Redirect siteswap to imgur. */
router.get('/:ss', function(req, res) {
  var ss = req.params.ss;
  dlog('Looking up siteswap for title:', ss);
  lookup.lookupByTitle(ss)
    .then(function (match) {
      dlog('Lookup for %s returned: %j', ss, match);
      if (_.isObject(match))
          res.redirect(match.link);
      else {
          notFound(res, ss);
      }
    })
    .catch(function (err) {
      notFound(res, ss);
    })
    .done();
});

/* Display siteswap GIF in a local page. */
router.get('/z/:ss', function(req, res) {
  var ss = req.params.ss;
  dlog('Looking up siteswap for title: %s', ss);
  lookup.lookupByTitle(ss)
    .then(function (match) {
      dlog('Lookup for %s returned: %j', ss, match);
      var imgur = match.link.substr(0, match.link.length-4);
      if (_.isObject(match))
        res.render('onesiteswap', { title: match.title, img: match.link, imgur: imgur });
      else {
        notFound(res, ss);
      }
    })
    .catch(function (err) {
      notFound(res, ss);
    })
    .done();
});

module.exports = router;
