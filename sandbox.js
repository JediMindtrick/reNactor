//var helloActor = require('./actors/hello/0.js');

/*
var nactor = require("nactor");
var actor = nactor.actor(helloActor.get());
// Intialize the actor
actor.init();
// Ask to execute the hello() method. It will be called in next tick
actor.ask("hello",["Node.js!",'test script']);
*/

var path = require('path');
var actorFolder = path.join(__dirname,'examples', 'actors');

var renactor = require('./index.js').system;
var sys = renactor('test',actorFolder);

sys.getActor('hello').then(function(actor){
    actor.init();
    // Ask to execute the hello() method. It will be called in next tick
    actor.ask("hello",["Node.js!",'test script']);
});

sys.getActor('hello',0).then(function(actor){
    actor.init();
    // Ask to execute the hello() method. It will be called in next tick
    actor.ask("hello",["Node.js!",'test script']);
});
