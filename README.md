# reNactor
nactor actor runtime


Based off of [nactor](https://github.com/benlau/nactor), this is a runtime for running a process of actors.  The goal is to provide the following features which are often missing in nodejs actor implementations:

1.  Basic Supervision
2.  Hot-swapping of actor implementations
3.  Location transparency of remote actors

###Test Harness
This project uses mocha and chai for automated testing.  Oh, and they're really integration tests, not unit tests. :)
```
$ npm install -g nodemon
$ npm testRunner
```
