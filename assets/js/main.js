var Application = {
    apiUrl: 'http://localhost/imagga-instagram/api/',

    initialize: function() {
        Photos.initialize();
        Toolbar.initialize();
    },

    _refineArguments: function(args) {
        // Remove the first value (usually an event object) from the arguments
        delete args[0];

        // Remove any undefined values in the arguments
        return _(args).filter(function(arg) {
            return (!_.isUndefined(arg));
        });
    }
};

_.extend(Application, Events);

$(function() {
    Application.initialize();
});