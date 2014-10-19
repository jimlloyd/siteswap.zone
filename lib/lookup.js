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

var defaultIndex = [
{"title":"441","link":"http://i.imgur.com/ijdIKPe.gif"},
{"title":"(6x,4)*","link":"http://i.imgur.com/jv4AG3T.gif"},
{"title":"(8x,6)*","link":"http://i.imgur.com/IarqHI8.gif"},
{"title":"1x(3x,2)R1x(3x,2)","link":"http://i.imgur.com/Ptz9IIh.gif"},
{"title":"R3R3R3*","link":"http://i.imgur.com/sUwpecD.gif"},
{"title":"(4x,2x)(2,[44])","link":"http://i.imgur.com/8QlBnRr.gif"},
{"title":"bj333333444444445555555555","link":"http://i.imgur.com/jyfh8vt.gif"},
{"title":"123456789","link":"http://i.imgur.com/pRR8hYU.gif"},
{"title":"(4,2x)*","link":"http://i.imgur.com/pdj5x7W.gif"},
{"title":"[52T]5[52T]552T[74]","link":"http://i.imgur.com/yicFLS3.gif"},
{"title":"[52T]5[52T]55[77777777772T][77777777774]","link":"http://i.imgur.com/BTOHKwi.gif"},
{"title":"423","link":"http://i.imgur.com/y9gcwPC.gif"},
{"title":"234","link":"http://i.imgur.com/alSrNtq.gif"},
{"title":"4[43]1","link":"http://i.imgur.com/NTp6AUS.gif"},
{"title":"(4,[42x])*","link":"http://i.imgur.com/YeS8VB2.gif"},
{"title":"th[e3]","link":"http://i.imgur.com/uAebJn7.gif"},
{"title":"tachhydrite","link":"http://i.imgur.com/nXiIoTo.gif"},
{"title":"(8x,6x)(4x,6x)*","link":"http://i.imgur.com/xvc3B3V.gif"},
{"title":"[43]333","link":"http://i.imgur.com/5mUewRM.gif"},
{"title":"[53]3333","link":"http://i.imgur.com/C6SBIKn.gif"},
{"title":"54440[34]","link":"http://i.imgur.com/nAL5BoW.gif"},
{"title":"(4x,2)*","link":"http://i.imgur.com/s93U9DI.gif"},
{"title":"531","link":"http://i.imgur.com/KIi8ifp.gif"},
{"title":"60","link":"http://i.imgur.com/MuuJqWv.gif"},
{"title":"7531","link":"http://i.imgur.com/Mgyvegp.gif"},
{"title":"trpnljhfdb97531","link":"http://i.imgur.com/WuIxqjj.gif"},
{"title":"ljhfdb97531","link":"http://i.imgur.com/voGpzWK.gif"},
{"title":"3","link":"http://i.imgur.com/8QLKMyv.gif"},
{"title":"900","link":"http://i.imgur.com/qyOQbFX.gif"},
{"title":"f0000","link":"http://i.imgur.com/ztKWSwL.gif"},
{"title":"522","link":"http://i.imgur.com/H3cyV2q.gif"},
{"title":"7333","link":"http://i.imgur.com/75INAp9.gif"},
{"title":"db97531","link":"http://i.imgur.com/x13aTIG.gif"},
{"title":"(6,6)","link":"http://i.imgur.com/vZfjQw4.gif"},
{"title":"(4x,4x)","link":"http://i.imgur.com/ao3fqrk.gif"},
{"title":"744","link":"http://i.imgur.com/aDIxNUG.gif"},
{"title":"855","link":"http://i.imgur.com/iaLoGWa.gif"},
{"title":"[43][32]3","link":"http://i.imgur.com/45vNyqN.gif"},
{"title":"501","link":"http://i.imgur.com/4sITQPy.gif"},
{"title":"50500","link":"http://i.imgur.com/ra8z9lL.gif"},
{"title":"52512","link":"http://i.imgur.com/NrNPKLD.gif"},
{"title":"50505","link":"http://i.imgur.com/B3POG1s.gif"},
{"title":"7070700","link":"http://i.imgur.com/5OUx7aZ.gif"},
{"title":"7272712","link":"http://i.imgur.com/52kMua4.gif"},
{"title":"7070707","link":"http://i.imgur.com/rmtFWxZ.gif"},
{"title":"531333","link":"http://i.imgur.com/vcSNWPl.gif"},
{"title":"5313","link":"http://i.imgur.com/wNgp3a5.gif"},
{"title":"53133","link":"http://i.imgur.com/dqg3c0M.gif"},
{"title":"441333","link":"http://i.imgur.com/VdYiArc.gif"},
{"title":"4413","link":"http://i.imgur.com/Lw0rGwW.gif"},
{"title":"44133","link":"http://i.imgur.com/u4LBSdA.gif"},
{"title":"53444","link":"http://i.imgur.com/AiuIBG8.gif"},
{"title":"534","link":"http://i.imgur.com/AN9Z3RO.gif"},
{"title":"53534","link":"http://i.imgur.com/EOlnczq.gif"},
{"title":"060","link":"http://i.imgur.com/WiTbBU8.gif"},
{"title":null,"link":"http://i.imgur.com/4rfistY.gif"},
{"title":"561","link":"http://i.imgur.com/BY162Lc.gif"},
{"title":"5345344","link":"http://i.imgur.com/azuYFB0.gif"},
{"title":"501561","link":"http://i.imgur.com/TjFiQM6.gif"},
{"title":"561501","link":"http://i.imgur.com/1FJ5aH8.gif"},
{"title":"561501531","link":"http://i.imgur.com/AQIUYle.gif"},
{"title":"[52]2[12]","link":"http://i.imgur.com/QaQczEi.gif"},
{"title":"521[52]2[12][52]6[12]","link":"http://i.imgur.com/ky920kO.gif"},
{"title":"521[52]2[12][52]2[12][52]6[12]561","link":"http://i.imgur.com/Vvp7DGt.gif"},
{"title":"521[52]6[12]561","link":"http://i.imgur.com/ZijFo5m.gif"},
{"title":"521[52]6[12]561561","link":"http://i.imgur.com/1XaqFym.gif"},
{"title":"521[52]6[12]561561561561561","link":"http://i.imgur.com/jA0m9pb.gif"},
{"title":"7522","link":"http://i.imgur.com/HKOVn8W.gif"},
{"title":"75224","link":"http://i.imgur.com/lLT4pys.gif"},
{"title":"75227531","link":"http://i.imgur.com/W5LMbjI.gif"},
{"title":"752275314","link":"http://i.imgur.com/TVX65bA.gif"},
{"title":"75314","link":"http://i.imgur.com/09QJk3M.gif"},
{"title":"(6x,4)(2,4x)*","link":"http://i.imgur.com/5KsKGsQ.gif"},
{"title":"(6x,4)(2,6x)(2,4)*","link":"http://i.imgur.com/qFsmaTm.gif"},
{"title":"(6x,4)(4,2x)*","link":"http://i.imgur.com/xPSfZrx.gif"},
{"title":"(6x,4)(2,0)*","link":"http://i.imgur.com/XKpoKd1.gif"},
{"title":"(6x,4)(0,6x)","link":"http://i.imgur.com/CKJ6Vtd.gif"},
{"title":"(4,6x)(6x,0)","link":"http://i.imgur.com/io6EVBQ.gif"},
{"title":"(6x,4)(4,6x)(0,4)(4,4)*","link":"http://i.imgur.com/wa31H96.gif"},
{"title":"(6x,4)(4,6x)(0,4)*","link":"http://i.imgur.com/yYMsxt1.gif"},
{"title":"ficken","link":"http://i.imgur.com/Ed9y6Ma.gif"},
{"title":"44444455550","link":"http://i.imgur.com/oO7dVno.gif"},
{"title":"444444552","link":"http://i.imgur.com/FVv3OJg.gif"},
{"title":"4444552","link":"http://i.imgur.com/eTpD1ME.gif"},
{"title":"44552","link":"http://i.imgur.com/iHWCsnX.gif"},
{"title":"552","link":"http://i.imgur.com/98VO3qB.gif"},
{"title":"444455550","link":"http://i.imgur.com/TmEPPm0.gif"},
{"title":"4455550","link":"http://i.imgur.com/0NP3c6i.gif"},
{"title":"55550","link":"http://i.imgur.com/PWruRSK.gif"},
{"title":"3333522","link":"http://i.imgur.com/u4BkNu3.gif"},
{"title":"33522","link":"http://i.imgur.com/XLceCFS.gif"},
{"title":"333335520","link":"http://i.imgur.com/YwBaXJj.gif"},
{"title":"3335520","link":"http://i.imgur.com/LiQYAL6.gif"},
{"title":"35520","link":"http://i.imgur.com/W8sOJaR.gif"},
{"title":"333355500","link":"http://i.imgur.com/OFRIead.gif"},
{"title":"3355500","link":"http://i.imgur.com/3FtkPqC.gif"},
{"title":"55500","link":"http://i.imgur.com/ZesEH3y.gif"},
{"title":"6666667777770","link":"http://i.imgur.com/KMz658s.gif"},
{"title":"66667777770","link":"http://i.imgur.com/8LvhmIo.gif"},
{"title":"667777770","link":"http://i.imgur.com/4Y09aSU.gif"},
{"title":"7777770","link":"http://i.imgur.com/mLsVM1n.gif"},
{"title":"423333","link":"http://i.imgur.com/pg4E6Q9.gif"},
{"title":"4233","link":"http://i.imgur.com/VoBzdKP.gif"},
{"title":"4242423333","link":"http://i.imgur.com/fNdcIpN.gif"},
{"title":"42","link":"http://i.imgur.com/qh8izC2.gif"},
{"title":"4233333","link":"http://i.imgur.com/f5Kd15w.gif"},
{"title":"42333","link":"http://i.imgur.com/SqwY89E.gif"},
{"title":"(4,2)(4x,2)*","link":"http://i.imgur.com/7KVwE5D.gif"},
{"title":"0400","link":"http://i.imgur.com/hQ0a3NK.gif"},
{"title":"060000","link":"http://i.imgur.com/dQPuCAT.gif"},
{"title":"04","link":"http://i.imgur.com/TfrhLIK.gif"},
{"title":"0602","link":"http://i.imgur.com/XZdOWSm.gif"},
{"title":"060600","link":"http://i.imgur.com/A59IARs.gif"},
{"title":"0800","link":"http://i.imgur.com/AvXDXc6.gif"},
{"title":"06","link":"http://i.imgur.com/DlZYClF.gif"},
{"title":"08080000","link":"http://i.imgur.com/3EOqT0N.gif"},
{"title":"080802","link":"http://i.imgur.com/4BfMgHZ.gif"},
{"title":"08080800","link":"http://i.imgur.com/0Gv15gA.gif"},
{"title":"0804","link":"http://i.imgur.com/eyBLKSG.gif"},
{"title":"08","link":"http://i.imgur.com/XwBJlBQ.gif"},
{"title":"111","link":"http://i.imgur.com/G49ncjp.gif"},
{"title":"114","link":"http://i.imgur.com/ebnXJY0.gif"},
{"title":"117","link":"http://i.imgur.com/OmViMBG.gif"},
{"title":"120","link":"http://i.imgur.com/4Etlq3P.gif"},
{"title":"123","link":"http://i.imgur.com/AQQybQZ.gif"},
{"title":"126","link":"http://i.imgur.com/iyZdlKr.gif"},
{"title":"129","link":"http://i.imgur.com/yym96iU.gif"},
{"title":"141","link":"http://i.imgur.com/7ZNerpl.gif"},
{"title":"144","link":"http://i.imgur.com/fs7GjM3.gif"},
{"title":"147","link":"http://i.imgur.com/JuYIHpz.gif"},
{"title":"150","link":"http://i.imgur.com/RRHReav.gif"},
{"title":"153","link":"http://i.imgur.com/up4vdEc.gif"},
{"title":"156","link":"http://i.imgur.com/vZRlRle.gif"},
{"title":"159","link":"http://i.imgur.com/0lF76DY.gif"},
{"title":"201","link":"http://i.imgur.com/lsUpMkn.gif"},
{"title":"204","link":"http://i.imgur.com/4A9B3xT.gif"},
{"title":"207","link":"http://i.imgur.com/tNGfXD8.gif"},
{"title":"222","link":"http://i.imgur.com/WfhDmjM.gif"},
{"title":"225","link":"http://i.imgur.com/3esKIYP.gif"},
{"title":"228","link":"http://i.imgur.com/q5yNsfX.gif"},
{"title":"231","link":"http://i.imgur.com/Vb6ZEBO.gif"},
{"title":"237","link":"http://i.imgur.com/a4RayVg.gif"},
{"title":"252","link":"http://i.imgur.com/YmwkA12.gif"},
{"title":"258","link":"http://i.imgur.com/8MuSPkj.gif"},
{"title":"300","link":"http://i.imgur.com/qVoHrkM.gif"},
{"title":"303","link":"http://i.imgur.com/QBSd4zk.gif"},
{"title":"306","link":"http://i.imgur.com/KiPiBUA.gif"},
{"title":"309","link":"http://i.imgur.com/9tJeyJB.gif"},
{"title":"312","link":"http://i.imgur.com/oFjdwSJ.gif"},
{"title":"315","link":"http://i.imgur.com/ZsfqKUK.gif"},
{"title":"318","link":"http://i.imgur.com/LPyEufF.gif"},
{"title":"330","link":"http://i.imgur.com/1ogDlr7.gif"},
{"title":"333","link":"http://i.imgur.com/wF6K0OZ.gif"},
{"title":"336","link":"http://i.imgur.com/VuNh6Zd.gif"},
{"title":"339","link":"http://i.imgur.com/4A9t47W.gif"},
{"title":"342","link":"http://i.imgur.com/aiW2tQb.gif"},
{"title":"345","link":"http://i.imgur.com/seJ7ua1.gif"},
{"title":"348","link":"http://i.imgur.com/065BlYo.gif"},
{"title":"411","link":"http://i.imgur.com/IGyQufl.gif"},
{"title":"414","link":"http://i.imgur.com/1DGcCez.gif"},
{"title":"417","link":"http://i.imgur.com/czC5OGq.gif"},
{"title":"420","link":"http://i.imgur.com/sk9eRGj.gif"},
{"title":"426","link":"http://i.imgur.com/5f27Ook.gif"},
{"title":"429","link":"http://i.imgur.com/ayAMhuJ.gif"},
{"title":"444","link":"http://i.imgur.com/pfagSEq.gif"},
{"title":"447","link":"http://i.imgur.com/YM0Vw09.gif"},
{"title":"255","link":"http://i.imgur.com/60rucnx.gif"},
{"title":"450","link":"http://i.imgur.com/2hL0Y2z.gif"},
{"title":"453","link":"http://i.imgur.com/jjDHeEl.gif"},
{"title":"456","link":"http://i.imgur.com/NNuVSoH.gif"},
{"title":"459","link":"http://i.imgur.com/k0AuuB4.gif"},
{"title":"504","link":"http://i.imgur.com/gHfaKRE.gif"},
{"title":"507","link":"http://i.imgur.com/K4DKO07.gif"},
{"title":"525","link":"http://i.imgur.com/VfoFMrR.gif"},
{"title":"528","link":"http://i.imgur.com/m2eEmrz.gif"},
{"title":"537","link":"http://i.imgur.com/PeRTH6c.gif"},
{"title":"555","link":"http://i.imgur.com/ZBZ191H.gif"},
{"title":"558","link":"http://i.imgur.com/qbIxApe.gif"},
{"title":"600","link":"http://i.imgur.com/Vyieavl.gif"},
{"title":"603","link":"http://i.imgur.com/OOpPk6y.gif"},
{"title":"606","link":"http://i.imgur.com/h7kcnQK.gif"},
{"title":"609","link":"http://i.imgur.com/fa7zwTX.gif"},
{"title":"612","link":"http://i.imgur.com/lnwajGi.gif"},
{"title":"615","link":"http://i.imgur.com/E2cbPBZ.gif"},
{"title":"618","link":"http://i.imgur.com/FOYKE5u.gif"},
{"title":"630","link":"http://i.imgur.com/7L9kH1v.gif"},
{"title":"633","link":"http://i.imgur.com/Wlt3zUO.gif"},
{"title":"636","link":"http://i.imgur.com/dyu5DKd.gif"},
{"title":"639","link":"http://i.imgur.com/gq4uLcd.gif"},
{"title":"642","link":"http://i.imgur.com/I7wVxFB.gif"},
{"title":"645","link":"http://i.imgur.com/AKkMVUa.gif"},
{"title":"648","link":"http://i.imgur.com/x46GTDc.gif"},
{"title":"711","link":"http://i.imgur.com/4kGMIEs.gif"},
{"title":"714","link":"http://i.imgur.com/YkLBFUY.gif"},
{"title":"717","link":"http://i.imgur.com/kYJmmkX.gif"},
{"title":"720","link":"http://i.imgur.com/EQr9e46.gif"},
{"title":"723","link":"http://i.imgur.com/xtQEawu.gif"},
{"title":"726","link":"http://i.imgur.com/9hYDtWf.gif"},
{"title":"729","link":"http://i.imgur.com/tfOTMCa.gif"},
{"title":"741","link":"http://i.imgur.com/QpMXP7C.gif"},
{"title":"747","link":"http://i.imgur.com/59u0asE.gif"},
{"title":"750","link":"http://i.imgur.com/tS68Gcs.gif"},
{"title":"753","link":"http://i.imgur.com/QFYbVxW.gif"},
{"title":"756","link":"http://i.imgur.com/C6l2EC6.gif"},
{"title":"759","link":"http://i.imgur.com/dPyNJVg.gif"},
{"title":"801","link":"http://i.imgur.com/NORUNeM.gif"},
{"title":"804","link":"http://i.imgur.com/fYeymNa.gif"},
{"title":"807","link":"http://i.imgur.com/57Z7qmk.gif"},
{"title":"822","link":"http://i.imgur.com/sXGcjbH.gif"},
{"title":"825","link":"http://i.imgur.com/xSyd06S.gif"},
{"title":"828","link":"http://i.imgur.com/vKd27me.gif"},
{"title":"831","link":"http://i.imgur.com/WtESujf.gif"},
{"title":"834","link":"http://i.imgur.com/oxWvW0z.gif"},
{"title":"837","link":"http://i.imgur.com/1cXLE0A.gif"},
{"title":"852","link":"http://i.imgur.com/t9Mfcjs.gif"},
{"title":"858","link":"http://i.imgur.com/9x8S5mw.gif"},
{"title":"903","link":"http://i.imgur.com/0Ti1Xzq.gif"},
{"title":"906","link":"http://i.imgur.com/N4WlXYr.gif"},
{"title":"909","link":"http://i.imgur.com/CqFLlvl.gif"},
{"title":"912","link":"http://i.imgur.com/WZPsFyl.gif"},
{"title":"915","link":"http://i.imgur.com/8wCpB7b.gif"},
{"title":"930","link":"http://i.imgur.com/39M6MDM.gif"},
{"title":"933","link":"http://i.imgur.com/HuqMLI4.gif"},
{"title":"936","link":"http://i.imgur.com/TcT8vY5.gif"},
{"title":"939","link":"http://i.imgur.com/HKVmnhh.gif"},
{"title":"942","link":"http://i.imgur.com/hm15D6s.gif"},
{"title":"945","link":"http://i.imgur.com/4CNpbSc.gif"},
{"title":"948","link":"http://i.imgur.com/MZGjTkV.gif"},
{"title":"1111","link":"http://i.imgur.com/uyRnQAG.gif"},
{"title":"1115","link":"http://i.imgur.com/HxluCND.gif"},
{"title":"1119","link":"http://i.imgur.com/dhg2xgA.gif"},
{"title":"1120","link":"http://i.imgur.com/L2L019J.gif"},
{"title":"1124","link":"http://i.imgur.com/FPtj5Xr.gif"},
{"title":"1128","link":"http://i.imgur.com/p5cjLx5.gif"},
{"title":"1151","link":"http://i.imgur.com/ES1NXAa.gif"},
{"title":"1155","link":"http://i.imgur.com/W3jvkU3.gif"},
{"title":"1159","link":"http://i.imgur.com/3P0qXQY.gif"},
{"title":"1201","link":"http://i.imgur.com/UPV57yr.gif"},
{"title":"1205","link":"http://i.imgur.com/ZFccYCT.gif"},
{"title":"1209","link":"http://i.imgur.com/1tdfJyF.gif"},
{"title":"1223","link":"http://i.imgur.com/JZBZdAr.gif"},
{"title":"1227","link":"http://i.imgur.com/AMEE1G8.gif"},
{"title":"1241","link":"http://i.imgur.com/97oA42r.gif"},
{"title":"1245","link":"http://i.imgur.com/4BCg5Fg.gif"},
{"title":"1249","link":"http://i.imgur.com/yMC08tG.gif"},
{"title":"918","link":"http://i.imgur.com/YIBIrae.gif"},
{"title":"30313","link":"http://i.imgur.com/eMgWC9N.gif"},
{"title":"23334","link":"http://i.imgur.com/pw4iS7M.gif"},
{"title":"35363","link":"http://i.imgur.com/7Jl6qlM.gif"},
{"title":"39","link":"http://i.imgur.com/wgQaptG.gif"},
{"title":"40","link":"http://i.imgur.com/EkInxt4.gif"},
{"title":"41424","link":"http://i.imgur.com/frQzN3y.gif"},
{"title":"34445","link":"http://i.imgur.com/CpKgg3n.gif"},
{"title":"46474","link":"http://i.imgur.com/WrvQeRh.gif"},
{"title":"84","link":"http://i.imgur.com/sY4DhyA.gif"},
{"title":"95051","link":"http://i.imgur.com/7gQ3u3r.gif"},
{"title":"52535","link":"http://i.imgur.com/fi4bmEc.gif"},
{"title":"45556","link":"http://i.imgur.com/zvkgzOT.gif"},
{"title":"57585","link":"http://i.imgur.com/uybiYAI.gif"},
{"title":"960","link":"http://i.imgur.com/l6P4rTz.gif"},
{"title":"1623","link":"http://i.imgur.com/wWbQKx7.gif"}
];

function extractResult(body) {
    try {
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
    catch (err) {
      console.error('Bad json result:', body);
      cachedIndex = defaultIndex;
      return new Q(defaultIndex);
    }
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
