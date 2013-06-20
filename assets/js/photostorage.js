var PhotoStorage = {
    localStorage: localStorage,

    setItem: function(itemName, item) {
        return this.localStorage.setItem(this.getStoragePath(itemName), JSON.stringify(item));
    },

    getItem: function(itemName) {
        var item = this.localStorage.getItem(this.getStoragePath(itemName));
        return item && JSON.parse(item);
    },

    removeItem: function(itemName) {
        return this.localStorage.removeItem(this.getStoragePath(itemName));
    },

    getStoragePath: function(itemName) {
        if (!_.isString(itemName)) return;

        return '/InstagramColorSearch/' + itemName;
    }
};