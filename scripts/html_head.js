var util = require('util'),
    exec = require('child_process').exec;


function runCommand(command, cb) {
    var child;
    console.log('command: ' + command)
    child = exec(command, cb);
};

var pHead = {
    init: function () {
        console.log('init plugin');
    },
    process: function (parameters) {
        console.log('do something');
    }
};

module.exports = pHead;