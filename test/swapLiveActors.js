var path = require('path'),
    helpers = require('./testHelpers.js');
    test = helpers.test;
    beginTest = helpers.beginTest,
    rmDir = helpers.rmDir,
    mkDir = helpers.mkDir,
    Promise = require("bluebird"),
    fs = Promise.promisifyAll(require("fs"));

var renactor = require('../index.js').system;

var deleteDirectories = function(){
    return rmDir(path.join(__dirname,'sandbox','actors','swapLiveActors'));
};

var makeDirectories = function(){
    return mkDir(path.join(__dirname,'sandbox','actors','swapLiveActors'));
};

var runTest = function(){

    beginTest('swapLiveActors.js');

    var actorFolder = path.join(__dirname, 'sandbox','actors');
    var sys = renactor('test',actorFolder);

    var rawPath = path.join(__dirname,'rawHello.js');
    var actorSource = '';

    return fs.readFileAsync(rawPath,'utf-8')

    .then(function(contents) {
        actorSource = contents;

        return sys.hotSwap('swapLiveActors',actorSource.replace('_version = {{X}}','_version = 0').replace('{{hello}}','hello'));
    })

    .then(function(){
        return sys.getActor('swapLiveActors')
            .then(function(actor){
                actor.init();

                actor.ask("salve",["Node.js!",'test script'],function(reply){
                    test(reply === "Done", 'reply === Done');
                });

                actor.ask('version',function(reply){
                    test(reply == 0,'version == 0');

                    sys.hotSwap('swapLiveActors',actorSource.replace('{{X}}','1').replace('{{hello}}','salve'))
                        .then(function(){

                            actor.ask("salve",["Node.js!",'test script'],function(reply){
                                test(reply === "Done", 'reply === Done');
                            });

                            actor.ask('version',function(rep2){
                                test(rep2 == 1,'version == 1');
                            });
                        });
                });

            });
    });
};

deleteDirectories()
.then(makeDirectories)
.then(runTest);
