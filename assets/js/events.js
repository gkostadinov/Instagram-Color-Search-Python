var Events = {
    object: $({}),

    on: function() {
        this.object.on.apply(this.object, arguments);
        return this;
    },

    off: function() {
        this.object.off.apply(this.object, arguments);
        return this;
    },

    trigger: function() {
        this.object.trigger.apply(this.object, arguments);
        return this;
    }
};