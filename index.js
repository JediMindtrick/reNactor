var path = require('path'),
    nactor = require('nactor'),
    Promise = require("bluebird"),
    fs = Promise.promisifyAll(require("fs")),
    cache = require('./actorCache.js');

var _system = function(name,actorPath){
    var _name = name;
    var _path = actorPath || path.join(__dirname, 'actors');

    var _getTypeDirectory = function(type){
        var folders = type.split('.');
        var requirePath = _path;
        folders.forEach(function(folder){
            requirePath = path.join(requirePath,folder);
        });

        return requirePath;
    };

    var _getMaxFileVersion = function(files){
        var max = -1;

        files.forEach(function(file){
            var fileParts = file.split('.');
            var curr = parseInt(fileParts[0]);
            if(curr > max) max = curr;
        });

        return max;
    };

    var _getActor = function(type,opts,specificVersion){

        var requirePath = _getTypeDirectory(type);

        return fs.readdirAsync(requirePath)
        .then(function(files){

            var version = specificVersion !== void(0) ? specificVersion : _getMaxFileVersion(files);

            requirePath = path.join(requirePath, version + '.js');

            var _actor = require(requirePath);

            var actor = nactor.actor(_actor.get());
            actor.init(opts);

            cache.cacheActor(type,actor,opts,version);

            return actor;
        });
    }

    cache.initCache(_getActor);

    return {
        getPath: function(){
            return _path;
        },
        getName: function(){
            return _name;
        },
        getActor: _getActor,
        hotSwap: function(type,src,swapVersions){

            var requirePath = _getTypeDirectory(type);

            return fs.readdirAsync(requirePath)
            .then(function(files){

                var max = _getMaxFileVersion(files);

                newPath = path.join(requirePath, (max + 1) + '.js');

                return fs.writeFileAsync(newPath,src);
            })
            .then(function(){
                return cache.swapCache(type,swapVersions);
            });

        }
    };
};

exports.system = _system;
