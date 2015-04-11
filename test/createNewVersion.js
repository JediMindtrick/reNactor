var path = require('path'),
    helpers = require('./testHelpers.js');
    test = helpers.test;
    beginTest = helpers.beginTest;
    actorFolder = path.join(__dirname, '..','actors'),
    Promise = require("bluebird"),
    fs = Promise.promisifyAll(require("fs"));

beginTest('createNewVersion.js');

var renactor = require('../index.js').system;
var sys = renactor('test',actorFolder);

var rawPath = path.join(__dirname,'rawHello2.js');
console.log(rawPath);

fs.readFileAsync(rawPath,'utf-8').then(function(contents) {

    sys.hotSwap('examples.hello',contents).then(function(){
        sys.getActor('examples.hello').then(function(actor){
            actor.init();


              actor.ask("salve",["Node.js!",'test script'],function(reply){
                  test(reply === "Done", 'reply === Done');
              });


            actor.ask('version',function(reply){
                test(reply == 2,'version == 2');
            });

        });
    });
});

/*
sys.getActor('examples.hello',0).then(function(actor){
    actor.init();
    // Ask to execute the hello() method. It will be called in next tick
    actor.ask("hello",["Node.js!",'test script'],function(reply){
        test(reply === "Done", 'reply === Done');
    });

    actor.ask('version',function(reply){
        test(reply == 0,'version == 0');
    });
});
*/
