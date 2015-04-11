
exports.get = function(){
    return {
        // Declare the context of your actor by an object
        salve : function(message) {
            // Actor method - "hello"
            var greeting = '{{hello}}';
            console.log(greeting + ': ' + message[0] + ', from: ' + message[1]);
            return "Done";
        },
        version: function(){
            var _version = {{X}};
            return _version;
        }
    };
}
