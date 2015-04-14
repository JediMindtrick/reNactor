var path        = require('path'),
    helpers     = require('./testHelpers.js');
    test        = helpers.test;
    beginTest   = helpers.beginTest,
    rmDir       = helpers.rmDir,
    mkDir       = helpers.mkDir,
    Promise     = require("bluebird"),
    fs          = Promise.promisifyAll(require("fs")),
    expect      = require("chai").expect;

var renactor = require('../index.js').system;

var deleteDirectories = function(){
    return rmDir(path.join(__dirname,'sandbox','actors','swapSkipVersions'));
};

var makeDirectories = function(){
    return mkDir(path.join(__dirname,'sandbox','actors','swapSkipVersions'));
};

//TODO: make this test more robust
var runTest = function(){

    var actorFolder = path.join(__dirname, 'sandbox','actors');
    var sys = renactor('test',actorFolder);

    var rawPath = path.join(__dirname,'rawHello.js.mustache');
    var actorSource = '';

    return fs.readFileAsync(rawPath,'utf-8')

    .then(function(contents) {
        actorSource = contents;

        return sys.hotSwap('swapSkipVersions',actorSource.replace('_version = {{X}}','_version = 0').replace('{{hello}}','hello'));
    })

    .then(function(){
        return sys.getActor('swapSkipVersions')
            .then(function(actor){
                actor.init();

                actor.ask("salve",["Node.js!",'test script'],function(reply){
                    expect(reply).to.equal('Done');
                });

                actor.ask('version',function(reply){
                    expect(reply).to.equal(0);

                    sys.hotSwap('swapSkipVersions',
                        actorSource.replace('{{X}}','1').replace('{{hello}}','salve'),
                        [0])

                        .then(function(){

                            actor.ask("salve",["Node.js!",'test script'],function(reply){
                                expect(reply).to.equal('Done');
                            });

                            actor.ask('version',function(rep2){
                                expect(rep2).to.equal(0);
                            });
                        });
                });

            });
    });
};

describe("Hot swap", function() {
    it("allows you to skip versions when swapping out already-running actors", function(done) {

        deleteDirectories()
        .then(makeDirectories)
        .then(runTest)
        .then(done);
    });
});
