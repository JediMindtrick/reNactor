var path = require('path'),
    helpers = require('./testHelpers.js');
    test = helpers.test;
    beginTest = helpers.beginTest;
    actorFolder = path.join(__dirname, '..','actors'),
    expect    = require("chai").expect;

var renactor = require('../index.js').system;
var sys = renactor('test',actorFolder);

describe("Load functions", function() {
    it("loads the latest version by default", function(done) {
        sys.getActor('examples.hello').then(function(actor){
            actor.init();
            // Ask to execute the hello() method. It will be called in next tick
            actor.ask("hello",["Node.js!",'test script'],function(reply){
                expect(reply).to.equal('Done');
            });

            actor.ask('version',function(reply){
                expect(reply).to.equal(1);
                done();
            });
        });
    });

    it("loads a specific version when asked", function(done) {
        sys.getActor('examples.hello',{},0).then(function(actor){
            actor.init();
            // Ask to execute the hello() method. It will be called in next tick
            actor.ask("hello",["Node.js!",'test script'],function(reply){
                expect(reply).to.equal('Done');
            });

            actor.ask('version',function(reply){
                expect(reply).to.equal(0);
                done();
            });
        });
    });
});
