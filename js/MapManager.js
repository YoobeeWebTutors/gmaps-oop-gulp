function MapManager() {
    //properties
    this.map;
    this.mapCanvas;
    this.config;
    this.currentLocation;
    this.currentMarkers = [];
    this.placeDetailContainer;

    this.placesService;

    // make this object accessable within callbacks
    var self = this;

    //methods

    this.init = function (mapId, config) {
        this.config = config;
        this.currentLocation = config.mapOptions.center;
        this.mapCanvas = document.querySelector('#' + mapId);
        this.map = new google.maps.Map(this.mapCanvas, config.mapOptions);

        if (config.geolocation) {
            this.doGeolocation();
        }
    }

    /**
     * Use Google Maps Places API to get places nearby
     * @param {Object} options - Config object
     */
    this.showLocations = function (options) {
        if (this.currentMarkers.length > 0) {
            this.clearMarkers();
        }
        this.placesService = new google.maps.places.PlacesService(this.map);
        if (!options.type) {
            throw new Error('Options object must include a type property');
        }
        if (!options.location) {
            options.location = this.currentLocation;
        }
        if (!options.radius) {
            options.radius = this.config.placesOptions.radius;
        }
        this.placesService.nearbySearch(options, this.onGetPlaces);
    }

    /**
     * Callback for Places service
     */
    this.onGetPlaces = function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                self.createMarker(results[i]);
            }
        }

    }


    this.createMarker = function (place) {
        var placeLoc = place.geometry.location;

        //place icon
        var icon = new google.maps.MarkerImage(
            place.icon,
            new google.maps.Size(71, 71),
            new google.maps.Point(0, 0),
            new google.maps.Point(17, 34),
            new google.maps.Size(25, 25));

        var marker = new google.maps.Marker({
            map: self.map,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
            icon: icon
        });

        //click listener for marker
        google.maps.event.addListener(marker, 'click', function () {
            if (!self.placeDetailContainer && self.config.placesOptions && self.config.placesOptions.detail.containerId) {
                self.placeDetailContainer = document.querySelector('#' + self.config.placesOptions.detail.containerId);
            }
            if (self.placeDetailContainer) {
                //this method call takes a custom callback
                self.getPlaceDetailHTML(place, function (html) {
                    if (html) {
                        self.placeDetailContainer.innerHTML = html;
                    }
                });
            }
        });

        //add to current markers
        self.currentMarkers.push(marker);
    }

    this.getPlaceDetailHTML = function (place, cb) {
        this.placesService.getDetails(place, function (place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log('place', place)
                var html = `<h2>${place.name}</h2>`;
                if (place.photos && place.photos.length > 0) {
                    var photoUrl = place.photos[0].getUrl(self.config.placesOptions.detail.imageDimensions)
                    html += `<img src="${photoUrl}">`;
                }
                if (place.reviews) {
                    html += `<ul>`;
                    for (var i = 0; i < place.reviews.length; i++) {
                        if (place.reviews[i].text) {
                            html += `<li>${place.reviews[i].text}</li>`;
                        }
                    }
                    html += `</ul>`;
                }
                //call custom callback
                cb(html);
            }
            cb(null);
        });
    }

    this.clearMarkers = function () {
        for (var i = 0; i < this.currentMarkers.length; i++) {
            var marker = this.currentMarkers[i];
            marker.setMap(null);
        }
        this.currentMarkers = [];
    }

    //geolocation

    this.doGeolocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showCurrentLocation, this.showGeolocationError);
        } else {
            this.mapCanvas.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    this.showCurrentLocation = function (position) {
        this.currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        self.map.setCenter(currentLocation);
        var marker = new google.maps.Marker({
            position: { lat: position.coords.latitude, lng: position.coords.longitude },
            map: self.map,
            title: 'Here I am!'
        });
    }

    this.showGeolocationError = function () {
        console.log('Geolocation error');
    }

    //end geolocation

}