// ~/dev/github/siteswap.zone/links.js

var Q = require('q');
var _ = require('lodash');
var request = require('request');

var cachedIndex = [];

function getIndex () {
  if (cachedIndex.length > 0)
    return new Q(cachedIndex);
  else {
    return fetchBody().then(extractResult);
  }
}

function findInCache(ss) {
  return _.find(cachedIndex, function(x) { return x.title === ss; });
}

function fetchBody() {
    var deferred = Q.defer();

    var options = {
      url: 'https://api.imgur.com/3/album/W6WFZ',
      headers: { 'Authorization': 'Client-ID 042c6dfd9efb8b2'},
    };

    request(options, function(error, response, body) {
      if (error)
        deferred.reject(error);
      else {
        deferred.resolve(body);
      }
    });

    return deferred.promise;
}

function extractResult(body) {
    var json = JSON.parse(body);

    var images = _.map(json.data.images, function(image) {
        return _.pick(image, ['title', 'link']);
    });

    images = _.filter(images, function(image) {
      return _.isString(image.title) && _.isString(image.link);
    });

    return new Q(images);
}

function lookupByTitle(ss) {
  var match = findInCache(ss);
  if (match)
    return new Q(match);
  else {
    var deferred = Q.defer();
    fetchBody()
      .then(extractResult)
      .done(function(newIndex) {
        if (newIndex.length > cachedIndex.length) {
          cachedIndex = newIndex;
        }
        match = findInCache(ss);
        if (match)
          deferred.resolve(match);
        else
          deferred.reject(new Error(ss+' not found in index.'));
      });
    return deferred.promise;
  }
}

module.exports = {
  getIndex: getIndex,
  lookupByTitle: lookupByTitle
};
