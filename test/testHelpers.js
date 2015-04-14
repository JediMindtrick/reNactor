var colors  = require('colors'),
    Promise = require("bluebird"),
    rimraf  = require('rimraf'),
    mkdirp  = require('mkdirp');

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
