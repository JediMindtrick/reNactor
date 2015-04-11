var colors = require('colors');

exports.test = function(bool,message){
    var msg = message || '';
    if(bool){
        console.log(('PASS: ' + msg).green.inverse);
        return 1;
    }else{
        console.error(('FAIL: ' + msg).red.inverse);
        return 0;
    }
};

exports.beginTest = function(message){
    console.log(('BEGIN TEST: ' + message).yellow.inverse);
};
