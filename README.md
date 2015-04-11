# reNactor
nactor actor runtime


Based off of [nactor](https://github.com/benlau/nactor), this is a runtime for running a process of actors.  The goal is to provide the following features which are often missing in nodejs actor implementations:

1.  Location transparency of remote actors
2.  Basic Supervision
3.  Hot-swapping of actor implementations

###Test Harness
```
$ npm install -g nodemon
$ npm testRunner
```
