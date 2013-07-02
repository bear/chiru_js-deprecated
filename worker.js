var config = require('getconfig');
var redis  = require('redis').createClient(config.redis.port, config.redis.host);
var Thoonk = require('thoonk').Thoonk;
var Job    = require('thoonk/job').Job;
var thoonk = new Thoonk(config.redis.host, config.redis.port, config.redis.db);

// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });


var getit = function() {
        jobs.get(0, function(err, item, gid) {
            console.log('Job ' + gid + ': ' + item);
            jobs.finish(gid, function(err, fid) {
                console.log('job ' + gid + ' marked as completed, queuing for next job');
                process.nextTick(getit);
            }, 'result');
        });
};

thoonk.registerType('Job', Job, function () {});

var jobs = thoonk.objects.Job('chiru_tasks', {});

jobs.init_subscribe();

jobs.once('subscribe_ready', function() {
    // jobs.publish(test, function (err, item, gid) {
    //   console.log('err ' + err);
    //   console.log('job ' + gid + ' pushed to queue');
    //   console.log('item ' + item);
    // });

    jobs.publish('{ task: "html_head.js", parameters: ["http://foo.com"] }', 
                 function(err, item, gid) {
                   console.log('job submitted');
                 },
                 false, null,
                 function (feed, id, result) {
                    console.log('job ' + id + ' has finished');
                    console.log(result);
                 })

    getit();
});

redis.quit();