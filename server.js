var config       = require('getconfig');
var path         = require('path');
var log          = require('bucker').createLogger(config, module);
var thoonk       = require('thoonk').createClient();
var Job          = require('thoonk-jobs');
var githubhook   = require('githubhook');
var jobPublisher;

thoonk.registerObject('Job', Job, function () {
    // var jobPublisher = thoonk.objects.Job('chiru_tasks', {});

    // jobPublisher.subscribe(function _subscribeCB() {

    //     jobPublisher.publish({ task: 'build', parameters: ['foo', 'bar', 'baz'] },
    //         {
    //             onFinish: function _finished(feed, id, result) {
    //                 log.info('job ' + id + ' has finished');
    //                 log.debug(result);
    //             },
    //         }, function _published() {
    //             log.info('published');
    //         }
    //     );
    // });
    jobPublisher = thoonk.objects.Job('chiru_tasks', {});
    jobPublisher.subscribe(function _subscribeCB() {});
});

if (config.hasOwnProperty('githubhook')) {
    var ghhook = githubhook(config.githubhook.options);

    ghhook.listen();

    ghhook.on('push', function _push(repo, ref, data) {
        log.info('hook called');
        jobPublisher.publish({ task: 'github', parameters: [ repo, ref, data] },
                {
                    onFinish: function _finished(feed, id, result) {
                        log.info('job ' + id + ' has finished');
                        log.debug(result);
                    },
                }, function _published() {
                    log.info('published');
                }
            );
    });
}
