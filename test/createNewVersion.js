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
    return rmDir(path.join(__dirname,'sandbox','actors','createNewVersion'));
};

var makeDirectories = function(){
    return mkDir(path.join(__dirname,'sandbox','actors','createNewVersion'));
};

var runTest = function(){

    var actorFolder = path.join(__dirname, 'sandbox','actors');
    var sys = renactor('test',actorFolder);

    var rawPath = path.join(__dirname,'rawHello.js.mustache');
    var actorSource = '';

    return fs.readFileAsync(rawPath,'utf-8')

    .then(function(contents) {
        actorSource = contents;

        return sys.hotSwap('createNewVersion',actorSource.replace('_version = {{X}}','_version = 0'));
    })

    .then(function(){
        return sys.getActor('createNewVersion')
            .then(function(actor){
                actor.init();

                actor.ask("salve",["Node.js!",'test script'],function(reply){
                    expect(reply).to.equal('Done');
                });

                actor.ask('version',function(reply){
                    expect(reply).to.equal(0);
                });

            });
    })

    .then(function(){
        return sys.hotSwap('createNewVersion',actorSource.replace('_version = {{X}}','_version = 1'));
    })

    .then(function(){
        return sys.getActor('createNewVersion').then(function(actor){
            actor.init();

            actor.ask("salve",["Node.js!",'test script'],function(reply){
                expect(reply).to.equal('Done');
            });

            actor.ask('version',function(reply){
                expect(reply).to.equal(1);
            });

        });
    });
};

describe("Hot swap", function() {
    it("allows you to load new versions for use", function(done) {
        deleteDirectories()
        .then(makeDirectories)
        .then(runTest)
        .then(done);
    });
});
