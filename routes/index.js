var express = require('express');
var router = express.Router();
var links = require('../links.js');
var _ = require('lodash');

// links = [{"title":"441","link":"http://i.imgur.com/ijdIKPe.gif"}, ... ]

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Siteswap Zone', links: links });
});

/* Redirect siteswap to imgur. */
router.get('/:ss', function(req, res) {
    var ss = req.params.ss;
    var match = _.find(links, function(x) { return x.title === ss; });
    if (match)
        res.redirect(match.link);
    else {
        res.status(404);
    }
});

/* Display siteswap GIF in a local page. */
router.get('/z/:ss', function(req, res) {
    var ss = req.params.ss;
    var match = _.find(links, function(x) { return x.title === ss; });
    if (match)
      res.render('onesiteswap', { title: match.title, img: match.link });
    else {
        res.status(404);
    }
});

module.exports = router;
