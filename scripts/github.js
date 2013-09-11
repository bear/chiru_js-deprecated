var util   = require('util');
var config = require('getconfig');
var log    = require('bucker').createLogger(config, module);
var exec   = require('child_process').exec;


function runCommand(command, cb) {
    var child;
    log.log('command: ' + command);
    child = exec(command, cb);
}

var build = {
    init: function _init() {
        log.log('init plugin');
    },
    process: function (task) {
        log.log('do something with');
        log.log(task.task);
        log.log(task.parameters);
        return task;
    }
};

module.exports = build;