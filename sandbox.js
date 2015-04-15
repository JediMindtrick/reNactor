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
var log = function(obj){
    console.log(JSON.stringify(obj));
}

var g = r.flip(r.contains);
//log(g([1,2,3],2));

var t = g([1,2,3,4,5]);
log(t(4));
log(t(7));

log(r.reject(t,[-1,6,7,8]));

log(r.reject(r.flip(r.contains)([11,12,13]),[10,11,12,13,14]));


var skipVersions = r.flip(r.contains)([11,12,13]);
var fromVersions = r.range(0,21);
var accFunc = function(arr,version){
    return arr.concat([version]);
}

log(r.reduce(accFunc,[],r.reject(skipVersions,fromVersions)));
