// ~/dev/github/siteswap.zone/lib/lookup.js

var Q = require('q');
var _ = require('lodash');
var request = require('request');
var dlog = require('debug')('lookup');

var cachedIndex = [];

var refresh = {
  nextScheduledTimeout: null,
  lastRefreshAt: 0
};

var millisPerMinute = 1000 * 60;
var refreshInterval = 30 * millisPerMinute;
var refreshThrottleRate = 2 * millisPerMinute;

function needRefresh() {
  var doRefresh = false;
  if (refreshInterval.lastRefreshAt === 0 || cachedIndex.length == 0)
    doRefresh = true;
  else {
    var now = Date.now();
    var elapsed = now - refresh.lastRefreshAt;
    doRefresh = elapsed > refreshThrottleRate;
  }

  if (doRefresh && refresh.nextScheduledTimeout !== null) {
    dlog('Cancelling previously scheduled refresh');
    clearTimeout(refresh.nextScheduledTimeout);
    refresh.nextScheduledTimeout = null;
  }

  return doRefresh;
}

function refreshNow() {
  refresh.lastRefreshAt = Date.now();
  refresh.nextScheduledTimeout = setTimeout(refreshNow, refreshInterval);

  dlog('Starting refresh now:', new Date(refresh.lastRefreshAt).toString());
  dlog('Next refresh at:', new Date(refresh.lastRefreshAt+refreshInterval).toString());

  return fetchBody().then(extractResult);
}


function getIndex () {
  if (needRefresh())
    return refreshNow();
  else {
    return new Q(cachedIndex);
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

    cachedIndex = images;

    return new Q(images);
}

function lookupByTitle(ss) {
  var match = findInCache(ss);
  if (match) {
    dlog('Siteswap ', ss, ' was found in cache.');
    return new Q(match);
  }
  else {
    dlog('Siteswap ', ss, ' was NOT found in cache. Refreshing index.');
    var deferred = Q.defer();
    getIndex()
      .done(function(newIndex) {
        match = findInCache(ss);
        if (_.isObject(match)) {
          dlog('Siteswap ', ss, ' was found after refreshing cache!');
          deferred.resolve(match);
        }
        else {
          dlog('Siteswap ', ss, ' was NOT found after refreshing cache.');
          deferred.reject(new Error(ss+' not found in index.'));
        }
      });
    return deferred.promise;
  }
}

module.exports = {
  getIndex: getIndex,
  lookupByTitle: lookupByTitle
};
