var Photos = {
    $el: $('#photos'),

    // This is the storage for all Instagram photos in the backend's database
    instagramPhotos: [],
    // Only these photos here will be shown on the page
    photosToShow: [],

    photoStorage: PhotoStorage,

    initialize: function() {
        // Class events
        this.on('photosChange', $.proxy(this.setPhotos, this))
            .on('photosUpdate', $.proxy(this.updatePhotos, this))
            .on('photosFilter', $.proxy(this.filterPhotos, this))
            .on('photosShow', $.proxy(this.showPhotos, this));


        this.loadPhotos();

        this.$el.packery({
            itemSelector: 'img',
            gutter: 2
        });
    },

    // Event methods

    setPhotos: function() {
        var photos = Application._refineArguments(arguments);

        // Set the array of all Instagram photos
        this.instagramPhotos = photos;

        if (!this.photoStorage.getItem('instagramPhotos')) {
            // If there are not any previous records in the localStorage, save the current photos there
            this.photoStorage.setItem('instagramPhotos', photos);
        }

        // Mark that we are (re)initializing the photos
        this.initialization = true;
        // Trigger photosShow event to show the photos
        this.trigger('photosShow', photos);
    },

    updatePhotos: function() {
        var photos = Application._refineArguments(arguments),
            currentPhotos = this.instagramPhotos;

        // Update the photos array (add new ones)
        _.each(photos, function(photo) {
            var photoId = photo.id,
                currentPhoto = _(currentPhotos).where({id: photoId});

            // Only add those photos that haven't been previously added
            if (!currentPhoto.length) {
                currentPhotos.push(photo);
            }
        });

        // Reset all loading buttons
        this._removeAllLoaders();
        // And reset the chosen colors in the toolbar
        Toolbar._resetColors();

        // Reset the photos in the storage
        this.photoStorage.removeItem('instagramPhotos');
        this.trigger('photosChange', currentPhotos);
    },

    filterPhotos: function() {
        var filteredPhotos = Application._refineArguments(arguments),
            photosToShow = [];

        // Get all photos which are going to be shown
        _.each(this.instagramPhotos, function(photo) {
            if (_(filteredPhotos).where({id: photo.id*1}).length) {
                photosToShow.push(photo);
            }
        });

        // Show them by triggering photosShow for those photos
        this.trigger('photosShow', photosToShow);
    },

    showPhotos: function() {
        var photos = Application._refineArguments(arguments),
            that = this;

        // Mark the photos that are going to be shown
        this.photosToShow = photos;

        if (photos.length === 0) {
            // If the result is empty - no photos, print an error
            this.printText('Sorry, no photos were found. :(<br>Try again with different colors.');
        } else {
            // Add the photos by prepending them in the DOM
            this.$el.html('');
            _.each(photos, function(photo) {
                that.$el.prepend('<img src="' + photo.url + '" id="' + photo.id + '">');
            });
        }

        // If the photos are not being (re)initialized, reset the Packery plugin
        if (!this.initialization) this._resetPackery();
        this.initialization = false;
    },

    // Class methods

    loadPhotos: function() {
        // Get photos from localStorage
        var localPhotos = this.photoStorage.getItem('instagramPhotos');

        // Check if there are any records in the localStorage
        if (localPhotos) {
            // If there are any records, trigger photosChange event
            // to set the photos in the localStorage if needed
            this.trigger('photosChange', localPhotos);
        } else {
            // Otherwise, get the photos from the backend
            this.getPhotos();
        }
    },

    getPhotos: function(update) {
        update = update || false;

        var that = this;
        $.getJSON(Application.apiUrl + '?method=getInstagramPhotos' + ((update) ? '&params=update' : ''), function(data) {
            // If new photos are being added, update the photo's array (event: photosUpdate)
            // If a completely new set of photos are fetched, change the photo's array (event: photosChange)
            that.trigger('photos' + ((!update) ? 'Change' : 'Update'), data);
        });
    },

    refreshPhotos: function() {
        // Adds new photos to the photo's array
        this.getPhotos(true);
    },

    getMatchingPhotos: function(filter) {
        if (_.isUndefined(filter) || !filter.length || filter.length > 20) {
            // If the input filter is not valid, reset the photos
            this._resetPhotos();
            // And the chosen colors in the taksbar
            Toolbar._resetColors();
            return;
        }

        // Stringify the input filter
        filter = filter.join(',');

        var that = this;
        $.getJSON(Application.apiUrl + '?method=getMatchingPhotos&params=' + filter, function(data) {
            // Trigger the photosFilter event and show those photos matching the results
            that.trigger('photosFilter', data);
        });
    },

    printText: function(text) {
        this.$el.html('<div class="no-photos"><h1>' + text + '</h1></div>');
    },

    _resetPhotos: function() {
        this.trigger('photosShow', this.instagramPhotos);
    },

    _resetPackery: function() {
        // Reload the packery items(photos)
        this.$el.packery('reloadItems');

        // And relayout them
        this.$el.packery();
    },

    _removeAllLoaders: function() {
        if (Toolbar.$el.find('.loadingNewPhotos').length) {
            Toolbar.$el.find('.loadingNewPhotos').each(function() {
                $(this).removeClass('loadingNewPhotos');
            });
        }
    }
};

_.extend(Photos, Events);