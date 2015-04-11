var path = require('path');

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

var rawPath = path.join(__dirname,'test','rawHello2.js');
console.log(rawPath);

fs.readFileAsync(rawPath,'utf-8')
.then(function(contents) {
    console.log('file read');
    console.log(contents);
})
.catch(function(err){
    console.log(err);
});
