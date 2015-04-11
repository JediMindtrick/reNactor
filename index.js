var path = require('path'),
    Q = require('q'),
    nactor = require('nactor'),
    promisify = require("promisify-node"),
    fs = promisify("fs");

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
        getActor: function(type,specificVersion){

            var toReturn = Q.defer();

            var requirePath = _getTypeDirectory(type);

            fs.readdir(requirePath)
            .then(function(files){

                var max = specificVersion !== void(0) ? specificVersion : _getMaxFileVersion(files);

                requirePath = path.join(requirePath, max + '.js');

                var _actor = require(requirePath);

                var actor = nactor.actor(_actor.get());

                toReturn.resolve(actor);
            });

            return toReturn.promise;
        }
    };
};

exports.system = _system;
