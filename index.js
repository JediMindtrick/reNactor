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

    var _getActor = function(type,opts,specificVersion){

        var requirePath = _getTypeDirectory(type);

        return fs.readdirAsync(requirePath)
        .then(function(files){

            var max = specificVersion !== void(0) ? specificVersion : _getMaxFileVersion(files);

            requirePath = path.join(requirePath, max + '.js');

            var _actor = require(requirePath);

            var actor = nactor.actor(_actor.get());
            actor.init(opts);

            _cacheActor(type,actor,opts);

            return actor;
        });
    }

    var actors = {};

    var _cacheActor = function(type,actor,opts){

        if(actors[type] == undefined){
            actors[type] = [];
        }
        actors[type].push([actor,opts]);
    };
    var _replaceAll = function(type){
        return new Promise(function(resolve,reject){

            var currentList = actors[type] || [];
            actors[type] = [];

            var allP = 0;

            if(currentList.length < 1) resolve([]);

            currentList.forEach(function(tuple){

                tuple[0].die(function(mailbox){

                    var _gotActor = _getActor(type,tuple[1]);
                    _gotActor.then(function(actor){
                        allP++;

                        tuple[0].setInternalActor(actor.getInternalActor());
                        if(allP == currentList.length){
                            actors[type] = currentList;
                            resolve(currentList);
                        }
                    });

                });
            });

        });
    };

    return {
        getPath: function(){
            return _path;
        },
        getName: function(){
            return _name;
        },
        getActor: _getActor,
        hotSwap: function(type,src){

            var requirePath = _getTypeDirectory(type);

            return fs.readdirAsync(requirePath)
            .then(function(files){

                var max = _getMaxFileVersion(files);

                newPath = path.join(requirePath, (max + 1) + '.js');

                //return fs.writeFileAsync(newPath,src);
                var writeP = fs.writeFileAsync(newPath,src);

                if(actors[type] != undefined){

                    return writeP.then(function(){
                        return _replaceAll(type);
                    });
                }else{
                    return writeP;
                }

            });

        }
    };
};

exports.system = _system;
