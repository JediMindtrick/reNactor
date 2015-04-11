var path = require('path'),
    nactor = require('nactor'),
    Promise = require("bluebird"),
    fs = Promise.promisifyAll(require("fs"));

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

    return {
        getPath: function(){
            return _path;
        },
        getName: function(){
            return _name;
        },
        getActor: function(type,specificVersion){

            var requirePath = _getTypeDirectory(type);

            return fs.readdirAsync(requirePath)
            .then(function(files){

                var max = specificVersion !== void(0) ? specificVersion : _getMaxFileVersion(files);

                requirePath = path.join(requirePath, max + '.js');

                var _actor = require(requirePath);

                var actor = nactor.actor(_actor.get());

                return actor;
            });
        },
        hotSwap: function(type,src){

//            console.log('hot swapping: ' + type);
//            console.log('new source: ' + src);

            var requirePath = _getTypeDirectory(type);

            return fs.readdirAsync(requirePath)
            .then(function(files){

                var max = _getMaxFileVersion(files);

                newPath = path.join(requirePath, (max + 1) + '.js');

                return fs.writeFileAsync(newPath,src);
            });

        }
    };
};

exports.system = _system;
