var Promise = require("bluebird");
var actors = {};
var _getActor = function(){};
var _cacheActor = function(type,actor,opts,versionNum/*int*/){

    if(actors[type] == undefined){
        actors[type] = [];
    }
    actors[type].push([actor,opts]);
};
var _replaceAll = function(type,swapVersions/*array*/){

    var currentList = actors[type] || [];
    actors[type] = [];

    if(currentList.length < 1) resolve([]);

    var all = [];

    currentList.forEach(function(tuple){

        tuple[0].die(function(mailbox){

            all.push(
                _getActor(type,tuple[1]).then(function(actor){
                    tuple[0].setInternalActor(actor.getInternalActor());
                })
            );

        });
    });

    return Promise.all(all);
};

exports.initCache = function(getFunc){
    _getActor = getFunc;
    actors = {};
};
exports.cacheActor = _cacheActor;
exports.replaceAll = _replaceAll;
exports.hasTypeCached = function(type){
    return actors[type] != undefined;
};
exports.swapCache = function(type){
    //if we have some actors already cached...
    if(exports.hasTypeCached(type)){
        return _replaceAll(type);
    }else{
        return new Promise(function(resolve,reject){
            resolve();
        });
    }
};
