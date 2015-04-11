var Promise = require("bluebird");
var actors = {
    'foo':{
        highestVersion: 0,
        caches:{
            '0': []
        }
    }
};
var _getActor = function(){};

var _cacheActor = function(type,actor,opts,versionNum/*int*/){

    var _num = versionNum || 0;

    if(actors[type] == undefined){
        actors[type] = {
            highestVersion: 0,
            caches:{
                '0': []
            }
        };
    }

    //bump version, if necessary
    if(_num > actors[type].highestVersion){
        actors[type].highestVersion = _num;
    }

    if(actors[type].caches[_num.toString()] == undefined){
        actors[type].caches[_num.toString()] = [];
    }

    actors[type].caches[_num.toString()].push([actor,opts]);
};

var _replaceVersion = function(type,version){
    var currentList = [];
    var _num = version || 0;

    if(actors[type] && actors[type].caches[_num.toString()]){
        currentList = actors[type].caches[_num.toString()];

        actors[type].caches[_num.toString()] = [];
    }

    if(currentList.length < 1) return [];

    var all = [];

    currentList.forEach(function(tuple){

        tuple[0].die(function(mailbox){

            all.push(
                _getActor(type,tuple[1]).then(function(actor){
                    tuple[0].setInternalActor(actor.getInternalActor());

                    _cacheActor(type,tuple[0],tuple[1],actors[type].highestVersion);
                })
            );

        });
    });

    return all;
};

var _replaceAll = function(type,skipVersions/*array*/){
    var skips = skipVersions || [];

    var toReturn = [];

    if(actors[type]){
        var toReplace = [];

        for(var i = 0, l = actors[type].highestVersion + 1; i < l; i++){
            toReplace.push(i);
        }

        skips.forEach(function(version){

            var index = toReplace.indexOf(version);
            if (index > -1) {
                toReplace.splice(index, 1);
            }
        });

        toReplace.forEach(function(version){
            toReturn = toReturn.concat(_replaceVersion(type,version));
        });
    }

    return Promise.all(toReturn);
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
exports.getCache = function(){
    return actors;
};
exports.swapCache = function(type,skipVersions){
    //if we have some actors already cached...
    if(exports.hasTypeCached(type)){
        return _replaceAll(type,skipVersions);
    }else{
        return new Promise(function(resolve,reject){
            resolve();
        });
    }
};
