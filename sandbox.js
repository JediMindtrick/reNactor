var r = require('ramda');

var filterOut = r.filter(r.not(r.contains));

var first = [1,2,3,4,5];
var exclude = [2,3];

var excludeFn = function(toExclude){
    return function(f){
        return r.not(r.contains(f,toExclude));
    }
};
var skipVersions = r.filter(excludeFn(exclude));
console.log(JSON.stringify(skipVersions(first)));

//console.log(JSON.stringify(r.reject(r.flip(r.contains)(exclude)),first);
