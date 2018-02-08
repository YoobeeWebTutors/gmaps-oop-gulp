$(function () {
    var schoolsEl = $('#schools-dropdown'),
        defaultLocation = { lat: -43.511296, lng: 172.595612 },
        mapMgr = new MapManager();

    //set up map
    var config = {
        mapOptions: {
            center: defaultLocation,
            zoom: 12
        },
        geolocation: false,
        placesOptions: {
            radius: 5000,
            detail: {
                containerId: 'place-detail',
                imageDimensions: {
                    maxWidth: 400, 
                    maxHeight: 400
                }
            }
        }
    };
    google.maps.event.addDomListener(window, 'load', function () {

        //initialise the Map Manager
        mapMgr.init('map-canvas', config);

        //set up UI
        schoolsEl.on('change', function () {
            var config = {
                type: [this.value]
            };
            mapMgr.showLocations(config);
        });
    });
});