var config = require('getconfig');
var path   = require('path');
var redis  = require('redis').createClient(config.redis.port, config.redis.host);
var Thoonk = require('thoonk').Thoonk;
var Job    = require('thoonk/job').Job;
var thoonk = new Thoonk(config.redis.host, config.redis.port, config.redis.db);

var pluginsPath = path.resolve(config.plugins_path || './scripts') + '/';
var plugins     = {};


var loadPlugin = function (name) {
    var fullname = pluginsPath + name;
    var plugin   = require.resolve(fullname);
    var pl       = require.cache[name];

    if (pl) {
        delete require.cache[name];
    }

    pl            = require(fullname);
    plugins[name] = pl;
    
    if (pl.init) {
        pl.init();
    }
};

var getit = function () {
    jobs.get(0, function _getCB(err, item, gid) {
        var result = null;
        console.log('Job ' + gid + ': ' + item.name);
        if (item.name) {
            if (plugins[item.name]) {
                var pl = plugins[name];
                result = { status: 'finished', result: pl.process(item) };
            } else {
                result = { status: 'error', result: 'plugin not found ' + item.name };
            }
        } else {
            result = { status: 'error', result: 'unknown script ' + item.name };
        }

        jobs.finish(gid, function _finishCB(err, fid) {
            console.log('job ' + gid + ' marked as completed, queuing for next job');
            process.nextTick(getit);
        }, result);
    });
};

thoonk.registerType('Job', Job); //, function () {});

var jobs = thoonk.objects.Job('chiru_tasks', {});

jobs.init_subscribe();

loadPlugin('html_head.js');

jobs.once('subscribe_ready', function _subscribeReadyCB() {
    // jobs.publish(test, function (err, item, gid) {
    //   console.log('err ' + err);
    //   console.log('job ' + gid + ' pushed to queue');
    //   console.log('item ' + item);
    // });

    jobs.publish('{ task: "html_head", parameters: ["http://foo.com"] }', 
                 function _publishSubmitted(err, item, gid) {
                        console.log('job submitted');
                    },
                 false, null,
                 function _publishFinished(feed, id, result) {
                        console.log('job ' + id + ' has finished');
                        console.log(result);
                    });

    getit();
});

redis.quit();