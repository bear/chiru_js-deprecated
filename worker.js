var config = require('getconfig');
var path   = require('path');
var async  = require('async');
var log    = require('bucker').createLogger(config, module);
var thoonk = require('thoonk').createClient();
var Job    = require('thoonk-jobs');

// var type = Function.prototype.call.bind( Object.prototype.toString );
var pluginsPath = path.resolve(config.plugins_path || './scripts') + '/';
var plugins     = {};


var loadPlugin = function (name) {
    var fullname = pluginsPath + name + '.js';
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

loadPlugin('html_head');
loadPlugin('build');

thoonk.registerObject('Job', Job, function _register() {
    var worker = thoonk.objects.Job('chiru_tasks');

    async.forever(function (next) {

        worker.get(0, function _getCB(err, payload, gid) {
            if (err) {
                log.error('worker.get error, queuing for next job');
                return next();
            }

            var result = null;
            var item   = JSON.parse(payload);
 
            log.info('Job ' + gid + ': ' + item.task);
            if (item.task) {
                log.debug('looking for plugin');
                var task = plugins[item.task];

                if (plugins[item.task]) {
                    var pl = plugins[item.task];
                    log.debug('calling plugin.process()');
                    result = { status: 'finished', result: pl.process(item) };
                } else {
                    log.debug('plugin not found');
                    result = { status: 'error', result: 'plugin not found ' + item.name };
                }

                log.info('marking job as: ' + result.status);

                worker.finish(gid, JSON.stringify(result), function _finishError(err) {});
            } else {
                log.warn('job does not have a defined task, skipping');
                worker.cancel(gid);
            }
            log.debug('queuing for next job');
            next();
        });
    });
});