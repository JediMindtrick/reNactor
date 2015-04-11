var path = require('path'),
    helpers = require('./testHelpers.js');
    test = helpers.test;
    beginTest = helpers.beginTest;
    actorFolder = path.join(__dirname, '..','actors');

beginTest('loadByVersion.js');

var renactor = require('../index.js').system;
var sys = renactor('test',actorFolder);
sys.getActor('examples.hello').then(function(actor){
    actor.init();
    // Ask to execute the hello() method. It will be called in next tick
    actor.ask("hello",["Node.js!",'test script'],function(reply){
        test(reply === "Done", 'reply === Done')
    });

    actor.ask('version',function(reply){
        test(reply == 1,'version == 0');
    });
});

sys.getActor('examples.hello',{},0).then(function(actor){
    actor.init();
    // Ask to execute the hello() method. It will be called in next tick
    actor.ask("hello",["Node.js!",'test script'],function(reply){
        test(reply === "Done", 'reply === Done')
    });

    actor.ask('version',function(reply){
        test(reply == 0,'version == 0');
    });
});
