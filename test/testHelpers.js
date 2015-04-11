var colors = require('colors'),
    Promise = require("bluebird"),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp');

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

exports.rmDir = function(path){
    return new Promise(function(resolve, reject) {
        rimraf(path,function(err){
            if(err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
};

exports.mkDir = function(path){
    return new Promise(function(resolve, reject) {
        mkdirp(path,function(err){
            if(err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
};
