console.log('hello 0 loading');

exports.get = function(){
    return {
        // Declare the context of your actor by an object

        hello : function(message) {
            // Actor method - "hello"
            console.log('hello: ' + message[0] + ', from: ' + message[1]);
            return "Done";
        }
    };
}
