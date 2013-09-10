var config = require('getconfig');
var path   = require('path');
var log    = require('bucker').createLogger(config, module);
var thoonk = require('thoonk').createClient();
var Job    = require('thoonk-jobs');

thoonk.registerObject('Job', Job, function () {
    var jobPublisher = thoonk.objects.Job('chiru_tasks', {});

    jobPublisher.subscribe(function _subscribeCB() {

        jobPublisher.publish({ task: 'build', parameters: ['foo', 'bar', 'baz'] },
            {
                onFinish: function _finished(feed, id, result) {
                    log.log('job ' + id + ' has finished');
                    console.log(result);
                    log.log(result);
                },
            }, function _published() {
                log.info('published');
            }
        );
    });
});